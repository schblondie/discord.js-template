const fs = require('fs')
const packageInfo = require('../package.json')
const path = require('path')
const chalk = require('chalk')

let lastCategory = ''
let lastEvent = ''
async function askCategory(inquirer) {
  const { categoryName } = await inquirer.prompt([
    {
      type:    'input',
      name:    'categoryName',
      message: 'Enter category name:',
      default: lastCategory,
    },
  ])

  lastCategory = categoryName
  return categoryName
}


async function addSlashCommand (inquirer) {
  const categoryName = await askCategory(inquirer)
  const { fileName, interactionName, description, guilds, isGlobal } = await inquirer.prompt([
    {
      type:    'input',
      name:    'fileName',
      message: 'Enter the file name (without .js):',
    },
    {
      type:    'input',
      name:    'interactionName',
      message: 'Enter the interaction name:',
    },
    {
      type:    'input',
      name:    'description',
      message: 'Enter the description:',
    },
    {
      type:    'input',
      name:    'guilds',
      message: 'Enter the guilds (comma separated):',
    },
    {
      type:    'confirm',
      name:    'isGlobal',
      message: 'Is the command global?',
      default: false,
    },
  ])

  const guildsArray = guilds ? `['${guilds.split(', ')
    .join('\',\'')}']` : '[]'

  const content = `
/**
 * @file Slash interaction: ${fileName}
 * @since ${packageInfo.version}
*/
const { SlashCommandBuilder } = require('discord.js')
module.exports = {
  global: ${isGlobal},
  guilds: ${guildsArray},
  data:   new SlashCommandBuilder()
    .setName('${interactionName}')
    .setDescription('${description ? description : 'TBA'}'),
  /**
 * @description Executes when the slash command with ID ${fileName} is called.
 * @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    // Your code here
  }
}
`.replace(/\n/g, '\r\n')

  const dir = path.join(__dirname, `../src/interactions/${categoryName}/slash/`)
  fs.mkdirSync(dir, { recursive: true })

  const filePath = path.join(dir, `${fileName.split('.js')[0]}.js`)
  if (fs.existsSync(filePath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type:    'confirm',
        name:    'overwrite',
        message: chalk.red('File already exists. Do you want to overwrite it?'),
        default: false,
      },
    ])

    if (!overwrite) {
      console.log(chalk.yellow('Operation cancelled.'))
      return
    }
  }

  fs.writeFileSync(filePath, content)
  console.log(chalk.green(`✔ Created slash command ${interactionName} in ${categoryName}`))
  console.log(chalk.blue(`Path: ${filePath}`))
}
async function addContextMenuCommand (inquirer) {
  const categoryName = await askCategory(inquirer)
  const { fileName, interactionName, type, guilds, isGlobal } = await inquirer.prompt([
    {
      type:    'input',
      name:    'fileName',
      message: 'Enter the file name (without .js):',
    },
    {
      type:    'input',
      name:    'interactionName',
      message: 'Enter the interaction name:',
    },
    {
      type:    'list',
      name:    'type',
      message: 'Enter the type:',
      choices: ['user', 'message'],
    },
    {
      type:    'input',
      name:    'guilds',
      message: 'Enter the guilds (comma separated):',
    },
    {
      type:    'confirm',
      name:    'isGlobal',
      message: 'Is the menu global?',
      default: false,
    },
  ])

  const guildsArray = guilds ? `['${guilds.split(', ')
    .join('\',\'')}']` : '[]'

  const content = `
/**
 * @file Context menu (type:${type}) interaction: ${fileName}
 * @since ${packageInfo.version}
*/
const { ContextMenuCommandBuilder } = require('discord.js')
module.exports = {
  global: ${isGlobal},
  guilds: ${guildsArray},
  data:   new ContextMenuCommandBuilder()
    .setName('${interactionName}')
    .setType(${type === 'user' ? 2 : 3}),
  /**
 * @description Executes when the context option with name "${fileName}" is clicked.
 * @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    // Your code here
  }
}
`.replace(/\n/g, '\r\n')

  const dir = path.join(__dirname, `../src/interactions/${categoryName}/contextMenu/`)
  fs.mkdirSync(dir, { recursive: true })

  const filePath = path.join(dir, `${fileName.split('.js')[0]}.js`)
  if (fs.existsSync(filePath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type:    'confirm',
        name:    'overwrite',
        message: chalk.red('File already exists. Do you want to overwrite it?'),
        default: false,
      },
    ])

    if (!overwrite) {
      console.log(chalk.yellow('Operation cancelled.'))
      return
    }
  }

  fs.writeFileSync(filePath, content)
  console.log(chalk.green(`✔ Created ${type} context menu interaction ${interactionName} in ${categoryName}`))
  console.log(chalk.blue(`Path: ${filePath}`))
}
async function addButtonInteraction (inquirer) {
  const categoryName = await askCategory(inquirer)
  const { fileName, interactionName } = await inquirer.prompt([
    {
      type:    'input',
      name:    'fileName',
      message: 'Enter the file name (without .js):',
    },
    {
      type:    'input',
      name:    'interactionName',
      message: 'Enter the interaction name:',
    },
  ])

  const content = `
/**
 * @file Button interaction: ${interactionName}
 * @since ${packageInfo.version}
*/
module.exports = {
  id: '${interactionName}',
  /**
 * @description Executes when the button with ID ${interactionName} is called.
 * @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    // Your code here
  }
}
`.replace(/\n/g, '\r\n')

  const dir = path.join(__dirname, `../src/interactions/${categoryName}/button/`)
  fs.mkdirSync(dir, { recursive: true })

  const filePath = path.join(dir, `${fileName.split('.js')[0]}.js`)
  if (fs.existsSync(filePath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type:    'confirm',
        name:    'overwrite',
        message: chalk.red('File already exists. Do you want to overwrite it?'),
        default: false,
      },
    ])

    if (!overwrite) {
      console.log(chalk.yellow('Operation cancelled.'))
      return
    }
  }

  fs.writeFileSync(filePath, content)
  console.log(chalk.green(`✔ Created button interaction ${interactionName} in ${categoryName}`))
  console.log(chalk.blue(`Path: ${filePath}`))
}
async function addSelectMenuInteraction(inquirer) {
  const categoryName = await askCategory(inquirer)
  const { fileName, interactionName } = await inquirer.prompt([
    {
      type:    'input',
      name:    'fileName',
      message: 'Enter the file name (without .js):',
    },
    {
      type:    'input',
      name:    'interactionName',
      message: 'Enter the interaction name:',
    },
  ])

  const content = `
/**
 * @file Select menu interaction: ${interactionName}
 * @since ${packageInfo.version}
*/
module.exports = {
  id: '${interactionName}',
  /**
 * @description Executes when the select menu with ID ${interactionName} is called.
 * @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    // Your code here
  }
}
`.replace(/\n/g, '\r\n')

  const dir = path.join(__dirname, `../src/interactions/${categoryName}/selectMenu/`)
  fs.mkdirSync(dir, { recursive: true })

  const filePath = path.join(dir, `${fileName.split('.js')[0]}.js`)
  if (fs.existsSync(filePath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type:    'confirm',
        name:    'overwrite',
        message: chalk.red('File already exists. Do you want to overwrite it?'),
        default: false,
      },
    ])

    if (!overwrite) {
      console.log(chalk.yellow('Operation cancelled.'))
      return
    }
  }

  fs.writeFileSync(filePath, content)
  console.log(chalk.green(`✔ Created select menu interaction ${interactionName} in ${categoryName}`))
  console.log(chalk.blue(`Path: ${filePath}`))
}
async function addModalInteraction(inquirer) {
  const categoryName = await askCategory(inquirer)
  const { fileName, interactionName } = await inquirer.prompt([
    {
      type:    'input',
      name:    'fileName',
      message: 'Enter the file name (without .js):',
    },
    {
      type:    'input',
      name:    'interactionName',
      message: 'Enter the interaction name:',
    },
  ])

  const content = `
/**
 * @file Modal interaction: ${interactionName}
 * @since ${packageInfo.version}
*/
module.exports = {
  id: '${interactionName}',
  /**
 * @description Executes when the modal with ID ${interactionName} is called.
 * @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    // Your code here
  }
}
`.replace(/\n/g, '\r\n')

  const dir = path.join(__dirname, `../src/interactions/${categoryName}/modal/`)
  fs.mkdirSync(dir, { recursive: true })

  const filePath = path.join(dir, `${fileName.split('.js')[0]}.js`)
  if (fs.existsSync(filePath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type:    'confirm',
        name:    'overwrite',
        message: chalk.red('File already exists. Do you want to overwrite it?'),
        default: false,
      },
    ])

    if (!overwrite) {
      console.log(chalk.yellow('Operation cancelled.'))
      return
    }
  }

  fs.writeFileSync(filePath, content)
  console.log(chalk.green(`✔ Created modal interaction ${interactionName} in ${categoryName}`))
  console.log(chalk.blue(`Path: ${filePath}`))
}
async function addEvent(inquirer) {
  const autocomplete = (await import('inquirer-autocomplete-prompt')).default
  inquirer.registerPrompt('autocomplete', autocomplete)
  const eventType = await inquirer.prompt([
    {
      type:    'autocomplete',
      name:    'eventType',
      message: 'Select the event type:',
      source:  function(answersSoFar, input) {
        input = input || ''
        return new Promise(function(resolve) {
          const choices = [
            'applicationCommandCreate',
            'applicationCommandDelete',
            'applicationCommandUpdate',
            'channelCreate',
            'channelDelete',
            'channelPinsUpdate',
            'channelUpdate',
            'debug',
            'warn',
            'emojiCreate',
            'emojiDelete',
            'emojiUpdate',
            'error',
            'guildBanAdd',
            'guildBanRemove',
            'guildCreate',
            'guildDelete',
            'guildUnavailable',
            'guildIntegrationsUpdate',
            'guildMemberAdd',
            'guildMemberAvailable',
            'guildMemberRemove',
            'guildMembersChunk',
            'guildMemberUpdate',
            'guildUpdate',
            'inviteCreate',
            'inviteDelete',
            'messageCreate',
            'messageDelete',
            'messageReactionRemoveAll',
            'messageReactionRemoveEmoji',
            'messageDeleteBulk',
            'messageReactionAdd',
            'messageReactionRemove',
            'messageUpdate',
            'presenceUpdate',
            'rateLimit',
            'invalidRequestWarning',
            'ready',
            'invalidated',
            'roleCreate',
            'roleDelete',
            'roleUpdate',
            'threadCreate',
            'threadDelete',
            'threadListSync',
            'threadMemberUpdate',
            'threadMembersUpdate',
            'threadUpdate',
            'typingStart',
            'userUpdate',
            'voiceStateUpdate',
            'webhookUpdate',
            'interactionCreate',
            'shardDisconnect',
            'shardError',
            'shardReady',
            'shardReconnecting',
            'shardResume',
            'stageInstanceCreate',
            'stageInstanceUpdate',
            'stageInstanceDelete',
            'stickerCreate',
            'stickerDelete',
            'stickerUpdate'
          ]
          const results = choices.filter(choice => choice.includes(input))
          if (lastEvent) {
            results.sort((a, b) => { return a === lastEvent ? -1 : b === lastEvent ? 1 : 0 })
          }
          resolve(results)
        })
      }
    }
  ])
    .then(answers => answers.eventType)
  lastEvent = eventType
  const { fileName, description } = await inquirer.prompt([
    {
      type:    'input',
      name:    'fileName',
      message: 'Enter the file name (without .js):',
    },
    {
      type:    'input',
      name:    'description',
      message: 'Enter the file description:',
    }
  ])
  const content = `
/**
 * @file Event: ${fileName}
 * @since ${packageInfo.version}
 * @description ${description}
*/
module.exports = {
  name: '${eventType}',
  /**
 * @description Executes when the event ${eventType} is emitted.
 * @param {Object} interaction The Interaction Object of the command.
*/
  async execute (interaction) {
    // Your code here
  }
}
`.replace(/\n/g, '\r\n')

  const dir = path.join(__dirname, `../src/events/client/${eventType}/`)
  fs.mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, `${fileName.split('.js')[0]}.js`)
  if (fs.existsSync(filePath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type:    'confirm',
        name:    'overwrite',
        message: chalk.red('File already exists. Do you want to overwrite it?'),
        default: false,
      },
    ])

    if (!overwrite) {
      console.log(chalk.yellow('Operation cancelled.'))
      return
    }
  }

  fs.writeFileSync(filePath, content)
  console.log(chalk.green(`✔ Created event ${eventType} in ${fileName}`))
  console.log(chalk.blue(`Path: ${filePath}`))
}

const runScript = async () => {
  const inquirer = (await import('inquirer')).default
  const { interactionType } = await inquirer.prompt([
    {
      type:    'list',
      name:    'interactionType',
      message: 'Which type of interaction to add?',
      choices: [
        'SlashCommand', 'ContextMenuCommand', 'ButtonInteraction', 'SelectMenuInteraction', 'ModalInteraction', 'Event', 'Exit'
      ],
    },
  ])

  const processInteraction = async () => {
    switch (interactionType) {
    case 'SlashCommand':
      await addSlashCommand(inquirer)
      break
    case 'ContextMenuCommand':
      await addContextMenuCommand(inquirer)
      break
    case 'ButtonInteraction':
      await addButtonInteraction(inquirer)
      break
    case 'SelectMenuInteraction':
      await addSelectMenuInteraction(inquirer)
      break
    case 'ModalInteraction':
      await addModalInteraction(inquirer)
      break
    case 'Event':
      await addEvent(inquirer)
      break
    case 'Exit':
      return process.exit(0)
    default:
      console.log(chalk.red('Invalid interaction type.'))
      break
    }
  }

  await processInteraction()
  runScript()
}

runScript()