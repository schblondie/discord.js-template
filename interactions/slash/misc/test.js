const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js')

/**
  * @file Slash interaction: test
  * @since 1.0.0
*/

module.exports = {
  global: false,                                                                                    // Global //? Default: false
  guilds: [],                                                                                       // Guilds //? Default: [] + Test Guild
  /***************************************************************************************************************************************************************/
  /**
   * @description The data of the slash command.
   * @type {import('discord.js').ApplicationCommandData}
  */
  data: new SlashCommandBuilder()
    .setName('test')                                                                               // Name                                         //! Required
    // .setNameLocalizations({ })                                                                   // Name Localizations
    .setDescription('Example command')                                                              // Description                                  //! Required
    // .setDescriptionLocalizations({ })                                                            // Description Localizations                    //* Optional
    .setDefaultMemberPermissions()                                                                  // Default Member Permissions //? Default: []
    .setDMPermission()                                                                              // Allow in DMs //? Default: true

  /***********************************************************************************************************************************************
    *? Add different options and subcommands to a command.
    ** They need a name and description.                                //? .setName().setDescription()
    ** The name can't be the same as other options.
    ** All options can have choices.                                    //? .addChoices()
    ** All options can have localizations.                              //? .setNameLocalizations().setDescriptionLocalizations()
    *? Subcommands:
      ** You can add multiple subcommands.
      ** Subcommands can have options.
    *? Options:
      ** You can add multiple options.
      ** You can add multiple options of the same type.
      ** All options can have autocomplete.                             //? .setAutocomplete()
      ** All options can have choices.                                  //? .addChoices()
      ** All options can be required or not.                            //? .setRequired()
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
    const modalModal = new ModalBuilder().setCustomId('modal').setTitle('title');
    // Add components to modal
    // Create the text input components
    const input_short = new TextInputBuilder()
      .setCustomId('input_short')
      // The label is the prompt the user sees for this input
      .setLabel('label')
      // Short means only a single line of text
      .setStyle(1);
    // An action row only holds one text input,
    const input_paragraph = new TextInputBuilder()
      .setCustomId('input_paragraph')
      // The label is the prompt the user sees for this input
      .setLabel('label')
      // Paragraph means multiple lines of text
      .setStyle(2);
    // An action row only holds one text input,
    // so you need one action row per text input.
    const input_shortRow = new ActionRowBuilder().addComponents(input_short);
    const input_paragraphRow = new ActionRowBuilder().addComponents(input_paragraph);
    // Add inputs to the modal
    modalModal.addComponents(input_shortRow, input_paragraphRow);
    // Show the modal to the user
    await interaction.showModal(modalModal);
  },
  async autocomplete (interaction) {
    const focusedOption = interaction.options.getFocused(true)
    let choices
    switch (focusedOption.name) {
      case 'string':
        choices = ['aaaaaaa', 'bbbbbb', 'ccccc', 'ddddd', 'eeeee', 'fffff', 'ggggg', 'hhhhh', 'iiiii', 'jjjjj', 'kkkkk', 'll']
        break
      default:
        break
    }
    const filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedOption.value))
    await interaction.respond(
      filtered.map(choice => ({
        name: choice,
        value: choice
      }))
    )
  }
}