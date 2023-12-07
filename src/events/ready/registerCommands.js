/* eslint-disable no-mixed-operators */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! DO NOT TOUCH THIS CODE UNLESS YOU KNOW WHAT YOU ARE DOING
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const { PermissionsBitField } = require('discord.js')
require('dotenv')
  .config()
const _ = require('lodash')

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
    function removeEmpty (object) {
      Object
        .entries(object)
        .forEach(([k, v]) => {
          if (v && typeof v === 'object') {
            removeEmpty(v)
          }
          if (v &&
            typeof v === 'object' &&
            !Object.keys(v).length ||
            v == null ||
            v == undefined ||
            v == '' ||
            v == [] ||
            v.length == 0
          ) {
            if (Array.isArray(object)) {
              object.splice(k, 1)
            } else if (!(v instanceof Date)) {
              delete object[k]
            }
          }
        })
      return object
    }
    function transformChoice (choice) {
      return {
        name:               choice.name,
        nameLocalizations:  choice.nameLocalizations ?? choice.name_localizations,
        value:              choice.value,
        valueLocalizations: choice.valueLocalizations ?? choice.value_localizations
      }
    }
    function transformOption (option) {
      return {
        choices:                  option.choices?.map(c => transformChoice(c)),
        autocomplete:             option.autocomplete,
        type:                     option.type,
        name:                     option.name,
        nameLocalizations:        option.nameLocalizations ?? option.name_localizations,
        description:              option.description,
        descriptionLocalizations: option.descriptionLocalizations ?? option.description_localizations,
        required:                 option.required,
        maxLength:                option.maxLength ?? option.max_length,
        minLength:                option.minLength ?? option.min_length,
        options:                  option.options?.map(o => transformOption(o)),
        channelTypes:             option.ChannelTypes ?? option.channel_types
      }
    }
    function transformCommand (command) {
      return {
        name:                     command.name,
        nameLocalizations:        command.nameLocalizations ?? command.name_localizations,
        description:              command.description,
        nsfw:                     command.nsfw,
        descriptionLocalizations: command.descriptionLocalizations ?? command.description_localizations,
        type:                     command.type,
        options:                  command.options?.map(o => transformOption(o)),
        defaultMemberPermissions: command.defaultMemberPermissions ?? command.default_member_permissions,
        dmPermission:             command.dm_permission ?? command.dmPermission
      }
    }
    console.log('\x1b[31m%s\x1b[0m', 'Starting command registration...')
    /**********************************************************************************************/
    // ? Register global slash commands
    const allSlashCommands = await client.slash
    const allContextMenuCommands = await client.contextMenu
    let globalCommandData = allSlashCommands.filter((c) => c.global)
    globalCommandData = globalCommandData.concat(allContextMenuCommands.filter((c) => c.global))
    let commandData = allSlashCommands.filter((c) => !c.global)
    commandData = commandData.concat(allContextMenuCommands.filter((c) => !c.global))
    if (process.env.PRODUCTION) {
      const globalCommands = await client.application.commands.fetch({ withLocalizations: true })
      // Create lists of global commands to add, update and delete
      const globalAdd = []
      const globalUpdate = []
      const globalCurrent = []
      const globalDelete = globalCommands.map(c => c)
      // Loop through global commands
      for (const command of globalCommandData) {
        const commandJSON = command[1].data.toJSON()
        const globalCommand = globalCommands.find((c) => c.name === commandJSON.name)
        /**************************************************************/
        // ? Remove undefined keys and values from filteredC & commandJSON
        // Filter c values to compare with commandJSON
        let filteredC = await _.pick(globalCommand, 'type', 'name', 'choices', 'nameLocalizations', 'description', 'descriptionLocalizations', 'options', 'defaultPermissions', 'defaultMemberPermissions', 'dmPermission')
        if (filteredC.type === 1) delete filteredC.type
        filteredC = removeEmpty(filteredC)
        // Make a copy of commandJSON to filter
        let filteredCommandJSON = _.cloneDeep(commandJSON)
        filteredCommandJSON = transformCommand(filteredCommandJSON)
        if (filteredCommandJSON.dmPermission === undefined) filteredCommandJSON.dmPermission = true
        filteredCommandJSON = removeEmpty(filteredCommandJSON)
        if (filteredCommandJSON.dmPermission === false) delete filteredCommandJSON.dmPermission
        if (filteredCommandJSON.defaultMemberPermissions) filteredCommandJSON.defaultMemberPermissions = new PermissionsBitField(filteredCommandJSON.defaultMemberPermissions)
        /**************************************************************/

        try {
          // Check if command changed
          if (_.isEqual(filteredC, filteredCommandJSON)) {
            globalDelete.splice(globalDelete.indexOf(globalCommand), 1)
            globalCurrent.push(commandJSON)
          } else {
            if (globalCommand) {
              globalUpdate.push(commandJSON)
              globalDelete.splice(globalDelete.indexOf(globalCommand), 1)
            } else {
              globalAdd.push(commandJSON)
            }
          }
        } catch {
          console.error('Error while comparing commands')
        }
      }
      const RestData = []
      if (globalAdd.length > 0) {
        RestData.push(...globalAdd)
      }
      if (globalUpdate.length > 0) {
        RestData.push(...globalUpdate)
      }
      if (RestData.length > 0) {
        RestData.push(...globalCurrent)
        // Put new all global commands with REST
        try {
          await client.application.commands.set(RestData)
        } catch (error) {
          console.error(error)
        }
        console.log('\x1b[33m%s\x1b[0m', 'Updating global commands')
        if (globalUpdate.length > 0) {
          console.log(`Updated ${globalUpdate.length} global commands: ${globalUpdate.map((c) => c.name)}`)
        }
        if (globalAdd.length !== 0) {
          console.log(`Created ${globalAdd.length} global commands: ${globalAdd.map((c) => c.name)}`)
        }
        console.log('_'.repeat(40))
      }
      if (globalDelete.length > 0) {
        // Delete all global commands with REST
        try {
          await client.application.commands.set([])
        } catch (error) {
          console.error(error)
        }
        console.log('There are no global commands anymore.')
      }
      /**********************************************************************************************/
      // ? Register guild slash commands
    } else {
      commandData = commandData.concat(globalCommandData)
      // Set zero global commands
      try {
        await client.application.commands.set([])
      } catch (error) {
        console.error(error)
      }
    }
    const guilds = await client.guilds.cache
    // Loop through guilds
    for (const guild of guilds) {
      if (process.env.PRODUCTION || guild[1].id === process.env.TEST_GUILD_ID) {
        const guildCommands = await guild[1].commands.fetch({ withLocalizations: true })
        // Create lists of commands to add, update and delete
        const guildAdd = []
        const guildUpdate = []
        const guildCurrent = []
        const guildDelete = guildCommands.map((c) => c) // ? This list starts with all guild commands
        for (const command of commandData) {
          const commandJSON = command[1].data.toJSON()
          if ((command[1].guilds && (command[1].guilds.includes(guild[1].id)) || guild[1].id === process.env.TEST_GUILD_ID)) {
            const c = guildCommands.find((c) => c.name === commandJSON.name)
            /**************************************************************/
            // ? Remove undefined keys and values from filteredC & commandJSON
            // Filter c values to compare with commandJSON
            let filteredC = await _.pick(c, 'type', 'name', 'choices', 'nameLocalizations', 'description', 'descriptionLocalizations', 'options', 'defaultPermissions', 'defaultMemberPermissions', 'dmPermission')
            if (filteredC.type === 1) delete filteredC.type
            filteredC = removeEmpty(filteredC)
            // Make a copy of commandJSON to filter
            let filteredCommandJSON = _.cloneDeep(commandJSON)
            filteredCommandJSON = transformCommand(filteredCommandJSON)
            filteredCommandJSON = removeEmpty(filteredCommandJSON)
            if (filteredCommandJSON.dmPermission === false) delete filteredCommandJSON.dmPermission
            if (filteredCommandJSON.defaultMemberPermissions) filteredCommandJSON.defaultMemberPermissions = new PermissionsBitField(filteredCommandJSON.defaultMemberPermissions)
            /**************************************************************/
            try {
              // Check if command changed
              if (_.isEqual(filteredC, filteredCommandJSON)) {
                // Delete command from guildDelete array
                guildDelete.splice(guildDelete.indexOf(c), 1)
                guildCurrent.push(commandJSON)
              } else {
                // Update command
                if (c) {
                  guildUpdate.push(commandJSON)
                  guildDelete.splice(guildDelete.indexOf(c), 1)
                } else guildAdd.push(commandJSON)
              }
            } catch {
              console.error('Error while comparing commands')
            }
          }
        }
        const RestData = []
        if (guildAdd.length > 0) {
          RestData.push(...guildAdd)
        }
        if (guildUpdate.length > 0) {
          RestData.push(...guildUpdate)
        }
        if (RestData.length > 0) {
          RestData.push(...guildCurrent)
          try {
            await guild[1].commands.set(RestData)
          } catch (error) {
            console.error(error)
          }
          // Yellow Log
          console.log('\x1b[33m%s\x1b[0m', 'Updating guild commands in guild ' + guild[1].id)
          if (guildUpdate.length > 0) {
            console.log(`Updated ${guildUpdate.length} commands: ${guildUpdate.map((c) => c.name)}`)
          }
          if (guildAdd.length !== 0) {
            console.log(`Created ${guildAdd.length} commands: ${guildAdd.map((c) => c.name)}`)
          }
          console.log('_'.repeat(40))
        }
        // Delete guild commands which don't exist anymore
        if (guildDelete.length > 0) {
          try {
            await guild[1].commands.set([])
          } catch (error) {
            console.error(error)
          }
          console.log(`There are no commands in guild ${guild[1].id} anymore.`)
        }
      } else {
        // Delete all guild commands
        try {
          await guild[1].commands.set([])
        } catch (error) {
          console.error(error)
        }
      }
      /**********************************************************************************************/
    }
    console.log('\x1b[32m%s\x1b[0m', 'Updated slash commands!\n')
  }
}
