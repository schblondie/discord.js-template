const { SlashCommandBuilder } = require('discord.js')

/**
  * @file Slash interaction: slash
  * @since 1.0.0
*/

module.exports = {
  global: true,                                                                                    // Global //? Default: false
  guilds: ['265117785686933515'],                                                                                       // Guilds //? Default: [] + Test Guild
  /***************************************************************************************************************************************************************/
  /**
   * @description The data of the slash command.
   * @type {import('discord.js').ApplicationCommandData}
  */
  data: new SlashCommandBuilder()
    .setName('slash')                                                                               // Name                                         //! Required
    // .setNameLocalizations({ })                                                                   // Name Localizations
    .setDescription('Example command')                                                              // Description                                  //! Required
    // .setDescriptionLocalizations({ })                                                            // Description Localizations                    //* Optional
    .setDefaultMemberPermissions()                                                                  // Default Member Permissions //? Default: []
    .setDMPermission()                                                                              // Allow in DMs //? Default: true

  /***********************************************************************************************************************************************
    *? Add different options and subcommands to a command.
    ** They need a name and description                                 //? .setName().setDescription()
    ** The name can't be the same as other options 
    ** All options can have choices                                     //? .addChoices()
    ** All options can have localizations                               //? .setNameLocalizations().setDescriptionLocalizations()
    *? Subcommands:
      ** You can add multiple subcommands 
      ** Subcommands can have options 
    *? Options:
      ** You can add multiple options 
      ** You can add multiple options of the same type 
      ** All options can have autocomplete                              //? .setAutocomplete()
      ** All options can have choices                                   //? .addChoices()
      ** All options can be required or not                             //? .setRequired()
      ** All options can have autocomplete                              //? .setNameLocalizations().setDescriptionLocalizations()
  ***********************************************************************************************************************************************/

  // .addSubcommand((subcommand) => subcommand                                                    // Subcommand
  // .addSubcommandGroup((subcommandGroup) => subcommandGroup                                     // Subcommand Group

  // .addStringOption((option) => option                                                          // String Option
  // .addIntegerOption((option) => option                                                         // Integer Option //? -2³² to 2³²
  // .addBooleanOption((option) => option                                                         // Boolean option //? true or false
  // .addUserOption((option) => option                                                            // User option
  // .addRoleOption((option) => option                                                            // Role option
  // .addMentionableOption((option) => option                                                     // Mentionable option //? User & Roles
  // .addChannelOption((option) => option                                                         // Channel option                                                                                                   
  // .addNumberOption((option) => option.setName().setDescription().setRequired())                // Float option //? -2³² to 2³²
  // .addAttachmentOption((option) => option.setName().setDescription().setRequired())            // Attachment Option

  /***************************************************************************************************************************************************************/
  /**
    * @description Executes when the slash command with ID label is called.
    * @param {import('discord.js').CommandInteraction} interaction - The slash interaction of the command.
  */
  , async execute (interaction) {
    interaction.reply({ content: 'Slash interaction executed!', ephemeral: true })
  }
  , async autocomplete (interaction) {
    const focusedOption = interaction.options.getFocused(true)                                    //? Get the focused option
    let choices
    switch (focusedOption.name) {
      case 'option':                                                                              //? The name of the focused option
        choices = ['choice1', 'choice2', 'choice3']                                               //? The choices of the focused option                
        break
      default:                                                                                    //? Default choices if the focused option doesn't have any specific choices
        choices = []
        break
    }
    const filtered = choices
      .filter((choice) => choice.toLowerCase().includes(focusedOption.value))                     //? Filter the choices by the focused option value
    await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })))             //? Respond with the filtered choices
  }
}