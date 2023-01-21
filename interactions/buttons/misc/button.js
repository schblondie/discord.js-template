/**
 * @file Button interaction: button
 * @since 1.0.0
*/
module.exports = {
  /**
    * @description Executes when the button with ID `button` is called.
    * @param {import('discord.js').ButtonInteraction} interaction - The button interaction of the command.
  */

  id: 'button',
  async execute (interaction) {
    interaction.reply({ content: 'Button interaction executed!', ephemeral: true })
  }
}