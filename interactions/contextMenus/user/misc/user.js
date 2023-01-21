const { ContextMenuCommandBuilder } = require('discord.js')

/**
 * @file Context menu (user) interaction: user
 * @since 1.0.0
*/
module.exports = {
  global: false,                                                                      // Global //? Default: false
  guilds: [],                                                                         // Guilds //? Default: [] + Test guild
  data: new ContextMenuCommandBuilder()
    .setName('user')
    .setType(2),                                                                      //? 2 is for user context menus
  /**
  * @description Executes when the context menu with ID user is called.
  * @param {import('discord.js').ContextMenuInteraction} interaction - The context menu interaction of the command.
  */
  async execute (interaction) {
    interaction.reply({ content: 'User context menu interaction executed!', ephemeral: true })
  },
}