/* eslint-disable no-console */
module.exports = {
  name: 'interactionCreate',
  /**
    * @description The interactionCreate event - see https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-interactionCreate
    * @param {Object} interaction - https://discord.js.org/#/docs/main/stable/class/Interaction
  */
  async execute (interaction) {
    /**
     * @description The Interaction command object
     * @type {Object}
     * @property {import('discord.js').Client} client - The client of the interaction.
    */
    let commandName = interaction.commandName ? interaction.commandName.split('-')[0] : null
    if (!commandName) commandName = interaction.customId ? interaction.customId.split('-')[0] : null
    const { client } = interaction
    // Auto Complete
    if (interaction.isAutocomplete()) {
      try {
        await client.slash.get(commandName)
          .autocomplete(interaction)
        return
      } catch (err) {
        console.log(err) // skipcq: JS-0002
        console.log(commandName) // skipcq: JS-0002
      }
    }

    // Button
    else if (interaction.isButton()) {
      try {
        await client.button.get(commandName)
          .execute(interaction)
        return
      } catch (err) {
        console.log(err) // skipcq: JS-0002
        console.log(commandName) // skipcq: JS-0002
      }
    }

    // Context Menu
    else if (interaction.isContextMenuCommand()) {
      // Get type of context menu
      let type = interaction.commandType
      const array = Array.from(client.contextMenu.values())
      try {
        // Get command with name and type
        const command = array.filter(command => command.data.name === commandName && command.data.type === type)
        await command[0].execute(interaction)
        return
      } catch (err) {
        console.log(err) // skipcq: JS-0002
        console.log(commandName) // skipcq: JS-0002
      }
    }

    // Modal
    else if (interaction.isModalSubmit()) {
      try {
        await client.modal.get(commandName)
          .execute(interaction)
        return
      } catch (err) {
        console.log(err) // skipcq: JS-0002
        console.log(commandName) // skipcq: JS-0002
      }
    }

    // Select Menu
    else if (interaction.isAnySelectMenu()) {
      try {
        await client.selectMenu.get(commandName)
          .execute(interaction)
        return
      } catch (err) {
        console.log(err) // skipcq: JS-0002
      }
      console.log(commandName) // skipcq: JS-0002
    }

    // Slash Command
    else if (interaction.isChatInputCommand()) {
      try {
        await client.slash.get(commandName)
          .execute(interaction)
        return
      } catch (err) {
        console.log(err) // skipcq: JS-0002
        console.log(commandName) // skipcq: JS-0002
      }
    } else return
  }
}
