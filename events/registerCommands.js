/* eslint-disable no-console */
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! DO NOT TOUCH THIS CODE UNLESS YOU KNOW WHAT YOU ARE DOING
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')
const { PermissionsBitField } = require('discord.js')
require('dotenv').config()
const _ = require('lodash')

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
/**
 * @file Command registration
 * @since 1.0.0
*/

module.exports = {
  name: 'ready',
  once: true,

  /**
   * @description Executes the block of code when client is ready (bot initialization)
   * @param {Object} client Main Application Client
   */

  async execute (client) {
    //! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //! DO NOT TOUCH THIS CODE UNLESS YOU KNOW WHAT YOU ARE DOING
    //! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    function removeEmpty (object) {
      Object
        .entries(object)
        .forEach(([k, v]) => {
          if (v && typeof v === 'object')
            removeEmpty(v);
          if (v &&
            typeof v === 'object' &&
            !Object.keys(v).length ||
            v == null ||
            v == undefined ||
            v.length == 0
          ) {
            if (Array.isArray(object))
              object.splice(k, 1);
            else if (!(v instanceof Date))
              delete object[k];
          }
        });
      return object;
    }
    function transformChoice (choice) {
      return {
        name: choice.name,
        nameLocalizations: choice.nameLocalizations ?? choice.name_localizations,
        value: choice.value,
        valueLocalizations: choice.valueLocalizations ?? choice.value_localizations
      }
    }
    function transformOption (option) {
      return {
        choices: option.choices?.map(c => transformChoice(c)),
        autocomplete: option.autocomplete,
        type: option.type,
        name: option.name,
        nameLocalizations: option.nameLocalizations ?? option.name_localizations,
        description: option.description,
        descriptionLocalizations: option.descriptionLocalizations ?? option.description_localizations,
        required: option.required,
        maxLength: option.maxLength ?? option.max_length,
        minLength: option.minLength ?? option.min_length
      }
    }
    function transformCommand (command) {
      return {
        name: command.name,
        nameLocalizations: command.nameLocalizations ?? command.name_localizations,
        description: command.description,
        nsfw: command.nsfw,
        descriptionLocalizations: command.descriptionLocalizations ?? command.description_localizations,
        type: command.type,
        options: command.options?.map(o => transformOption(o)),
        defaultMemberPermissions: command.defaultMemberPermissions ?? command.default_member_permissions,
        dmPermission: command.dmPermission ?? command.dm_permission
      };
    }
    console.log('\x1b[31m%s\x1b[0m', 'Starting command registration...')
    /**********************************************************************************************/
    //? Register global slash commands

    const globalCommandData = [...Array.from(client.globalSlashCommands), ...Array.from(client.globalContextMenuCommands)]
    const commandData = [...Array.from(client.slashCommands), ...Array.from(client.contextMenuCommands)]
    const globalCommands = await client.application.commands.fetch({ withLocalizations: true })
    // Create lists of global commands to add, update and delete
    const globalAdd = []
    const globalUpdate = []
    const globalDelete = globalCommands.map(c => c)
    // Loop through global commands
    for (const command of globalCommandData) {
      let commandJSON = command[1].data.toJSON()
      commandJSON = transformCommand(commandJSON)
      const globalCommand = globalCommands.find((c) => c.name === commandJSON.name)
      /**************************************************************/
      //? Remove undefined keys and values from filteredC & commandJSON
      // Filter c values to compare with commandJSON
      let filteredC = await _.pick(globalCommand, 'type', 'name', 'choices', 'nameLocalizations', 'description', 'descriptionLocalizations', 'options', 'defaultPermissions', 'defaultMemberPermissions', 'dmPermission')
      if (filteredC.type === 1) delete filteredC.type
      if (filteredC.defaultMemberPermissions)
        filteredC = removeEmpty(filteredC)
      // Make a copy of commandJSON to filter
      let filteredCommandJSON = _.cloneDeep(commandJSON)
      filteredCommandJSON = removeEmpty(filteredCommandJSON)
      if (filteredCommandJSON.dmPermission === false) delete filteredCommandJSON.dmPermission
      if (filteredCommandJSON.defaultMemberPermissions) filteredCommandJSON.defaultMemberPermissions = new PermissionsBitField(filteredCommandJSON.defaultMemberPermissions)
      else filteredCommandJSON.defaultMemberPermissions = new PermissionsBitField(0n)
      /**************************************************************/

      try {
        // Check if command changed
        if (_.isEqual(filteredC, filteredCommandJSON)) {
          globalDelete.splice(globalDelete.indexOf(globalCommand), 1)
        } else {
          // Update command
          await client.application.commands.edit(command[0], commandJSON)
          await globalUpdate.push(commandJSON.name)
          globalDelete.splice(globalDelete.indexOf(globalCommand), 1)
        }
      } catch {
        // Add command
        await globalAdd.push(commandJSON)
      }
    }
    if (globalUpdate.length > 0) console.log(`Updated ${globalUpdate.length} global commands: ${globalUpdate}`)
    // Put new global commands with REST
    if (globalAdd > 0) {
      try {
        await rest.put(
          Routes.applicationCommands(client.user.id),
          { body: globalAdd }
        )
      } catch (error) {
        console.error(error)
      }
      console.log(`Created ${globalAdd.length} global commands: ${globalAdd.map((c) => c.name)}`)
    }
    // Delete global commands which don't exist anymore
    try {
      for (const command of globalDelete) {
        await client.application.commands.delete(command)
      }
    } catch (error) {
      console.error(error)
    }
    if (globalDelete > 0) console.log(`Deleted ${globalDelete.length} global commands: ${globalDelete.map((c) => c.name)}`)

    /**********************************************************************************************/
    //? Register guild slash commands

    const guilds = await client.guilds.cache
    // Loop through guilds
    for (const guild of guilds) {
      const guildCommands = await guild[1].commands.fetch({ withLocalizations: true })
      // Create lists of commands to add, update and delete
      const guildAdd = []
      const guildUpdate = []
      const guildDelete = guildCommands.map((c) => c)                            //? This list starts with all guild commands
      for (const command of commandData) {
        let commandJSON = command[1].data.toJSON()
        commandJSON = transformCommand(commandJSON)
        if ((command[1].guilds && (command[1].guilds.includes(guild[1].id)) || guild[1].id === process.env.TEST_GUILD_ID)) {
          const c = guildCommands.find((c) => c.name === commandJSON.name)
          /**************************************************************/
          //? Remove undefined keys and values from filteredC & commandJSON
          // Filter c values to compare with commandJSON
          let filteredC = await _.pick(c, 'type', 'name', 'choices', 'nameLocalizations', 'description', 'descriptionLocalizations', 'options', 'defaultPermissions', 'defaultMemberPermissions', 'dmPermission')
          if (filteredC.type === 1) delete filteredC.type
          if (filteredC.defaultMemberPermissions)
            filteredC = removeEmpty(filteredC)
          // Make a copy of commandJSON to filter
          let filteredCommandJSON = _.cloneDeep(commandJSON)
          filteredCommandJSON = removeEmpty(filteredCommandJSON)
          if (filteredCommandJSON.dmPermission === false) delete filteredCommandJSON.dmPermission
          if (filteredCommandJSON.defaultMemberPermissions) filteredCommandJSON.defaultMemberPermissions = new PermissionsBitField(filteredCommandJSON.defaultMemberPermissions)
          else filteredCommandJSON.defaultMemberPermissions = new PermissionsBitField(0n)
          /**************************************************************/
          try {
            // Check if command changed
            if (_.isEqual(filteredC, filteredCommandJSON)) {
              // Delete command from guildDelete array
              console.log(`Command ${commandJSON.name} in guild ${guild[1].id} is up to date`)
              guildDelete.splice(guildDelete.indexOf(c), 1)
            } else {
              guildDelete.splice(guildDelete.indexOf(c), 1)
            }
          } catch (e) {
            // Add command
            guildAdd.push(commandJSON)
          }
        }
      }
      if (guildUpdate.length > 0) console.log(`Updated ${guildUpdate.length} commands in guild ${guild[1].id}: ${guildUpdate}`)
      if (guildAdd.length > 0) {
        try {
          await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild[1].id),
            { body: guildAdd }
          )
        } catch (error) {
          console.error(error)
        }
        console.log(`Created ${guildAdd.length} commands in guild ${guild[1].id}: ${guildAdd.map((c) => c.name)}`)
      }
      // Delete guild commands which don't exist anymore
      try {
        for (const command of guildDelete) {
          await guild[1].commands.delete(command)
        }
      } catch (error) {
        console.error(error)
      }
      if (guildDelete.length > 0) console.log(`Deleted ${guildDelete.length} commands in guild ${guild[1].id}: ${guildDelete.map((c) => c.name)}`)

      /**********************************************************************************************/
    }
    console.log('\x1b[32m%s\x1b[0m', 'Updated slash commands!')
  }
}
