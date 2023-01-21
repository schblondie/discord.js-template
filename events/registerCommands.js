//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! DO NOT TOUCH THIS CODE UNLESS YOU KNOW WHAT YOU ARE DOING
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')
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
    console.log('\x1b[31m%s\x1b[0m', `Starting command registration...`)
    /**********************************************************************************************/
    //? Register global slash commands

    const globalCommandData = [...Array.from(client.globalSlashCommands), ...Array.from(client.globalContextMenuCommands)]
    const commandData = [...Array.from(client.slashCommands), ...Array.from(client.contextMenuCommands)]
    const globalCommands = await client.application.commands.fetch()
    // Create lists of global commands to add, update and delete
    const globalAdd = []
    const globalUpdate = []
    const globalDelete = globalCommands.map((c) => c.id)                              //? This list starts with all global commands
    // Loop through global commands
    for (const command of globalCommandData) {
      let commandJSON
      try {
        // Slash commands
        commandJSON = command[1].data.toJSON()
      } catch {
        // Context menu commands
        commandJSON = command[1].data
      }
      const globalCommand = globalCommands.find((c) => c.name === commandJSON.name)
      // Filter c values to compare with commandJSON
      const filteredC = _.pick(globalCommand, 'type', 'name', 'nameLocalizations', 'description', 'descriptionLocalization', 'options', 'defaultPermissions', 'dmPermission')

      /**************************************************************/
      //? Remove undefined keys and values from filteredC & commandJSON

      for (const key in filteredC) {
        if (filteredC[key] == undefined || filteredC[key] == [] || filteredC[key] == {} || filteredC[key] == '') delete filteredC[key]
      }
      if (filteredC.type === 1) delete filteredC.type
      Object.entries(filteredC).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => {
            Object.entries(item).forEach(([valueKey, val]) => {
              if (val === undefined) delete item[valueKey]
            })
          })
        }
      })
      // Make a copy of commandJSON to filter
      let filteredCommandJSON = _.cloneDeep(commandJSON)
      for (const key in filteredCommandJSON) {
        if (filteredCommandJSON[key] == undefined || filteredCommandJSON[key] == [] || filteredCommandJSON[key] == {} || filteredCommandJSON[key] == '') delete filteredCommandJSON[key]
      }
      Object.entries(filteredCommandJSON).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => {
            Object.entries(item).forEach(([valueKey, val]) => {
              if (val === undefined) delete item[valueKey]
            })
          })
        }
      })
      /**************************************************************/

      try {
        // Check if command changed
        if (_.isMatch(filteredC, filteredCommandJSON, { deep: true }) && _.isMatch(filteredCommandJSON, filteredC, { deep: true })) {
          globalDelete.splice(globalDelete.indexOf(command[0]), 1)
        } else {
          // Update command
          await client.application.commands.edit(command[0], commandJSON)
          await globalUpdate.push(commandJSON.name)
          globalDelete.splice(globalDelete.indexOf(command[0]), 1)
        }
      } catch {
        // Add command
        await globalAdd.push(commandJSON)
      }
    }
    if (globalUpdate.length > 0) console.log(`Updated ${globalUpdate.length} global commands: ${globalUpdate}`)
    // Put new global commands with REST
    if (globalAdd > 0) {
      await client.application.commands.create(globalAdd)
      console.log(`Created ${globalAdd.length} global commands: ${globalAdd.map((c) => c.name)}`)
    }
    // Delete global commands which don't exist anymore
    for (const command of globalDelete) {
      await client.application.commands.delete(command)
    }
    if (globalDelete > 0) console.log(`Deleted ${globalDelete.length} global commands: ${globalDelete.map((c) => c.name)}`)

    /**********************************************************************************************/
    //? Register guild slash commands

    const guilds = await client.guilds.cache
    // Loop through guilds
    for (const guild of guilds) {
      const guildCommands = await guild[1].commands.fetch()
      // Create lists of commands to add, update and delete
      const guildAdd = []
      const guildUpdate = []
      const guildDelete = guildCommands.map((c) => c.id)                              //? This list starts with all global commands
      for (const command of commandData) {
        let commandJSON
        try {
          // Slash commands
          commandJSON = command[1].data.toJSON()
        } catch {
          // Context menu commands
          commandJSON = command[1].data
        }
        if ((command[1].guilds.includes(guild[1].id) || guild[1].id === process.env.TEST_GUILD_ID)) {
          const c = guildCommands.find((c) => c.name === commandJSON.name)
          // Filter c values to compare with commandJSON
          const filteredC = _.pick(c, 'type', 'name', 'nameLocalizations', 'description', 'descriptionLocalization', 'options', 'defaultPermissions', 'dmPermission')

          /**************************************************************/
          //? Remove undefined keys and values from filteredC & commandJSON

          for (const key in filteredC) {
            if (filteredC[key] == undefined || filteredC[key] == [] || filteredC[key] == {} || filteredC[key] == '') delete filteredC[key]
          }
          if (filteredC.type === 1) delete filteredC.type
          Object.entries(filteredC).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(item => {
                Object.entries(item).forEach(([valueKey, val]) => {
                  if (val === undefined) delete item[valueKey]
                })
              })
            }
          })
          // Make a copy of commandJSON to filter
          const filteredCommandJSON = _.cloneDeep(commandJSON)
          for (const key in filteredCommandJSON) {
            if (filteredCommandJSON[key] == undefined || filteredCommandJSON[key] == [] || filteredCommandJSON[key] == {} || filteredCommandJSON[key] == '') delete filteredCommandJSON[key]
          }
          Object.entries(filteredCommandJSON).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(item => {
                Object.entries(item).forEach(([valueKey, val]) => {
                  if (val === undefined) delete item[valueKey]
                })
              })
            }
          })
          /**************************************************************/

          try {
            // Check if command changed
            if (_.isEqual(filteredC, filteredCommandJSON)) {
              guildDelete.splice(guildDelete.indexOf(c.id), 1)
            } else {
              // Update command
              await guild[1].commands.edit(c, commandJSON)
              await guildUpdate.push(commandJSON.name)
              guildDelete.splice(guildDelete.indexOf(c.id), 1)
            }
          }
          catch {
            // Add command
            guildAdd.push(commandJSON)
          }
        }
      }
      if (guildUpdate.length > 0) console.log(`Updated ${guildUpdate.length} commands in guild ${guild[1].id}: ${guildUpdate}`)

      if (guildAdd.length > 0) {
        await guild[1].commands.create(guildAdd)
        console.log(`Created ${guildAdd.length} commands in guild ${guild[1].id}: ${guildAdd.map((c) => c.name)}`)
      }
      // Delete guild commands which don't exist anymore
      for (const command of guildDelete) {
        await guild[1].commands.delete(command)
      }
      if (guildDelete.length > 0) console.log(`Deleted ${guildDelete.length} commands in guild ${guild[1].id}: ${guildDelete.map((c) => c.name)}`)

      /**********************************************************************************************/
    }
    console.log('\x1b[32m%s\x1b[0m', 'Updated slash commands!')
  }
}
