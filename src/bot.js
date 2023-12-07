/**
 * @file Main File of the bot, responsible for registering events, commands, interactions etc.
 * @version 2.0.0
*/

// Importing all required modules.
const { Client, GatewayIntentBits } = require('discord.js') // Importing required discord.js modules
require('dotenv')
  .config() // Accessing .env file
const { loadClientEvents, loadClientInteractions } = require('./register')
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
  intents: new Discord.IntentsBitField([ // Uncomment the intents you want to use. //? https://discord.com/developers/docs/topics/gateway#list-of-intents
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
module.exports = client // Exporting the client for other files to use.

// Login into your client application with bot's token.
client.login(process.env.TOKEN)

// Registering all events and interactions.
loadClientEvents(client)
loadClientInteractions(client)