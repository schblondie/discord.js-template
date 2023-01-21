/**
 * @file Select menu interaction: selectMenu
 * @since 1.0.0
*/
module.exports = {
  id: 'selectMenu',
  /**
  * @description Executes when the select menu with ID selectMenu is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    interaction.reply({ content: 'Select menu interaction executed!', ephemeral: true })
  }
}