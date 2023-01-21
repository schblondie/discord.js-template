const { ContextMenuCommandBuilder } = require('discord.js')

/**
 * @file Context menu (message) interaction: message
 * @since 1.0.0
*/
module.exports = {
  global: false,                                                                      // Global //? Default: false
  guilds: [],                                                                         // Guilds //? Default: [] + Test guild
  data: new ContextMenuCommandBuilder()
    .setName('message')
    .setType(3),                                                                      //? 3 is for message context menus
  /**
  * @description Executes when the context menu with ID message is called.
  * @param {import('discord.js').ContextMenuInteraction} interaction - The context menu interaction of the command.
  */
  async execute (interaction) {
    interaction.reply({ content: 'Message context menu interaction executed!', ephemeral: true })
  },
}