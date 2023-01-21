/**
 * @file Modal interaction: modal
 * @since 1.0.0
*/
module.exports = {
  /**
    * @description Executes when the modal with ID modal is called.
    * @param {import('discord.js').ModalInteraction} interaction - The modal interaction of the command.
  */

  id: 'modal',
  async execute (interaction) {
    interaction.reply({ content: 'Modal interaction executed!', ephemeral: true })
  }
}