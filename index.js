/**
 * @file Main File of the bot, responsible for registering events, commands, interactions etc.
 * @version 1.0.0
*/

// Importing all required modules.
const fs = require('fs')                                                              // File System
const { Client, Collection, GatewayIntentBits } = require('discord.js')               // Importing required discord.js modules
require('dotenv').config()                                                            // Accessing .env file

/**
 * @description The Discord Client.
 * @type {Client}
 * @constant
 * @name client
 */

/**********************************************************************/
//? Create a new client instance

const Discord = require('discord.js')
const client = new Client({
  intents: new Discord.IntentsBitField([                                              // Uncomment the intents you want to use. //? https://discord.com/developers/docs/topics/gateway#list-of-intents
    // GatewayIntentBits.Guilds,
    // GatewayIntentBits.GuildMembers, //! Privileged Intent
    // GatewayIntentBits.GuildModeration,
    // GatewayIntentBits.GuildEmojisAndStickers,
    // GatewayIntentBits.GuildIntegrations,
    // GatewayIntentBits.GuildWebhooks,
    // GatewayIntentBits.GuildInvites,
    // GatewayIntentBits.GuildVoiceStates,
    // GatewayIntentBits.GuildPresences, //! Privileged Intent
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.GuildMessageReactions,
    // GatewayIntentBits.GuildMessageTyping,
    // GatewayIntentBits.DirectMessages,
    // GatewayIntentBits.DirectMessageReactions,
    // GatewayIntentBits.DirectMessageTyping,
    // GatewayIntentBits.MessageContent, //! Privileged Intent
    // GatewayIntentBits.GuildScheduledEvents,
    // GatewayIntentBits.AutoModerationConfiguration,
    // GatewayIntentBits.AutoModerationExecution
  ])
})
module.exports = client                                                               // Exporting the client for other files to use.

/**********************************************************************/
//? Registering all events.

/**
 * @description All event files of the event handler.
 * @type {String[]}
 */

const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'))

// Loop through all files and execute the event when it is actually emmited.
for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client))
  } else {
    client.on(
      event.name,
      async (...args) => await event.execute(...args, client)
    )
  }
}

/**********************************************************************/
// Registration of Slash-Command Interactions.
client.slashCommands = new Collection()
client.globalSlashCommands = new Collection()
client.autoCompleteCommands = new Collection()

const slashCommands = fs.readdirSync('./interactions/slash')                          // All slash commands are stored in this folder.
for (const module of slashCommands) {
  const commandFiles = fs
    .readdirSync(`./interactions/slash/${module}`)
    .filter((file) => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./interactions/slash/${module}/${file}`)
    if (command.global) {
      client.globalSlashCommands.set(command.data.name, command)                      // Registering the command in the Collection. //? Global commands will be shown twice in the command list, when you register them in a guild.
    }
    client.slashCommands.set(command.data.name, command)                              // Registering the command in the Collection.
  }
}
/**********************************************************************/
// Registration of Context-Menu Interactions.
client.contextMenuCommands = new Collection()
client.globalContextMenuCommands = new Collection()

const userContextMenuCommands = fs.readdirSync('./interactions/contextMenus/user')
const messageContextMenuCommands = fs.readdirSync('./interactions/contextMenus/message')
for (const module of userContextMenuCommands) {
  const commandFiles = fs
    .readdirSync(`./interactions/contextMenus/user/${module}`)
    .filter((file) => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./interactions/contextMenus/user/${module}/${file}`)
    if (command.global) {
      client.globalContextMenuCommands.set(command.data.name, command)                // Registering the command in the Collection. //? Global commands will be shown twice in the command list, when you register them in a guild.
    }
    client.contextMenuCommands.set(command.data.name, command)                        // Registering the command in the Collection.
  }
}
for (module of messageContextMenuCommands) {
  const commandFiles = fs
    .readdirSync(`./interactions/contextMenus/message/${module}`)
    .filter((file) => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./interactions/contextMenus/message/${module}/${file}`)
    if (command.global) {
      client.globalContextMenuCommands.set(command.data.name, command)                // Registering the command in the Collection. //? Global commands will be shown twice in the command list, when you register them in a guild.
    }
    client.contextMenuCommands.set(command.data.name, command)                        // Registering the command in the Collection.
  }
}

/**********************************************************************/
// Registration of Button Interactions.
client.buttonCommands = new Collection()
const buttonCommands = fs.readdirSync('./interactions/buttons')
for (const module of buttonCommands) {
  const commandFiles = fs
    .readdirSync(`./interactions/buttons/${module}`)
    .filter((file) => file.endsWith('.js'))

  for (const commandFile of commandFiles) {
    const command = require(`./interactions/buttons/${module}/${commandFile}`)
    client.buttonCommands.set(command.id, command)
  }
}
/**********************************************************************/
// Registration of Modal Interactions.
client.modalCommands = new Collection()
const modalCommands = fs.readdirSync('./interactions/modals')
for (const module of modalCommands) {
  const commandFiles = fs
    .readdirSync(`./interactions/modals/${module}`)
    .filter((file) => file.endsWith('.js'))

  for (const commandFile of commandFiles) {
    const command = require(`./interactions/modals/${module}/${commandFile}`)
    client.modalCommands.set(command.id, command)
  }
}
/**********************************************************************/
// Registration of Select Menu Interactions.
client.selectMenuCommands = new Collection()
const selectMenus = fs.readdirSync('./interactions/selectMenus')
for (const module of selectMenus) {
  const commandFiles = fs
    .readdirSync(`./interactions/selectMenus/${module}`)
    .filter((file) => file.endsWith('.js'))
  for (const commandFile of commandFiles) {
    const command = require(`./interactions/selectMenus/${module}/${commandFile}`)
    client.selectMenuCommands.set(command.id, command)
  }
}
/**********************************************************************/
// Login into your client application with bot's token.
client.login(process.env.TOKEN)
