module.exports = {
  /**
 * @description Executes when an interaction is created
 * @param {import('discord.js').Interaction} interaction - The interaction of the command.
  */

  name: 'interactionCreate',
  async execute (interaction) {
    /**
     * @description The Interaction command object
     * @type {Object}
     * @property {import('discord.js').Client} client - The client of the interaction.
    */
    const { client } = interaction
    if (interaction.isButton()) {
      try {
        await client.buttonCommands.get(interaction.customId).execute(interaction)
        return
      }
      catch (err) {
        console.log(err)
      }
    }
    if (interaction.isAutocomplete()) {
      try {

        await client.slashCommands.get(interaction.commandName).autocomplete(interaction)
        return
      }
      catch (err) {
        console.log(err)
      }
    }
    // Context Menu
    if (interaction.isContextMenuCommand()) {
      // Get type of context menu
      let type = interaction.commandType
      const array = Array.from(client.contextMenuCommands.values())
      try {
        // Get command with name and type
        const command = array.filter(command => command.data.name === interaction.commandName && command.data.type === type)
        await command[0].execute(interaction)
        return
      }
      catch (err) {
        console.log(err)
      }
    }
    // Modal
    if (interaction.isModalSubmit()) {
      console.log('Modal submit')
      try {
        await client.modalCommands.get(interaction.commandName).execute(interaction)
        return
      }
      catch (err) {
        console.log(err)
      }
    }
    // Select Menu
    if (interaction.isAnySelectMenu()) {
      try {
        await client.selectMenuCommands.get(interaction.customId).execute(interaction)
        return
      }
      catch (err) {
        console.log(err)
      }
    }
    // Slash Command
    if (interaction.isChatInputCommand()) {
      try {
        await client.slashCommands.get(interaction.commandName).execute(interaction)
        return
      }
      catch (err) {
        console.log(err)
      }
    }
  }
}
