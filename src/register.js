//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! DO NOT TOUCH THIS CODE UNLESS YOU KNOW WHAT YOU ARE DOING
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * @file Responsible for registering events, commands, interactions etc.
 * @version 2.0.0
*/
const { Collection } = require('discord.js')
const fs = require('fs')
require('colors')
function registerInteractionType (client, interactionType, module, file) {
  try {
    delete require.cache[require.resolve(`./interactions/${module}/${interactionType}/${file}`)]
  }
  catch {
    // Do nothing
  }
  const fileData = require(`./interactions/${module}/${interactionType}/${file}`)
  client[interactionType].set(
    fileData.data ? fileData.data.name : fileData.id,
    fileData
  )
}
function loadClientInteractions (client, path, deleteFile) {
  if (deleteFile) {
    try {
      path = path.replace(/\\/g, '/')
      path = path.split('src/interactions/')[1]
      // Check if path exists
      if (!fs.existsSync(`./src/interactions/${path}`)) {
        delete require.cache[require.resolve(`./interactions/${path}`)]
        console.log('[-]'.red + ` Deleted ${path}`)
      }
    }
    catch {
      // Do nothing
    }
    return
  }
  /**********************************************************************/
  // Registration of Slash-Command Interactions.
  const interactionsFolder = fs.readdirSync('./src/interactions')
  if (!path) {
    client.slash = new Collection()
    client.button = new Collection()
    client.modal = new Collection()
    client.selectMenu = new Collection()
    client.contextMenu = new Collection()
    for (const module of interactionsFolder) {
      const moduleFolderPath = `./src/interactions/${module}`
      if (!fs.lstatSync(moduleFolderPath)
        .isDirectory()) continue
      const moduleFolder = fs.readdirSync(`./src/interactions/${module}`)
      for (const interactionType of moduleFolder) {
        const interactionTypeFolderPath = `./src/interactions/${module}/${interactionType}`
        if (!fs.lstatSync(interactionTypeFolderPath)
          .isDirectory()) continue
        const interactionTypeFolder = fs
          .readdirSync(`./src/interactions/${module}/${interactionType}`)
          .filter((file) => file.endsWith('.js'))
        for (const file of interactionTypeFolder) {
          try {
            registerInteractionType(client, interactionType, module, file)
          } catch (error) {
            console.log(error)
          }
        }
      }
    }
    console.log('[+]'.green + ' Loaded all interactions')
  } else {
    path = path.replace(/\\/g, '/')
    const module = path.split('/')[2]
    const interactionType = path.split('/')[3]
    const file = path.split('/')[4]
    if(!module || !interactionType || !file) return
    try {
      registerInteractionType(client, interactionType, module, file)
      console.log('[~]'.yellow + ` Loaded ${path}`)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = {
  loadClientInteractions,
  loadClientEvents
}

async function loadClientEvents (client) {
  const path = './src/events/client'
  await delete client._events
  const folders = fs.readdirSync(path)
  for (const folder of folders) {
    const files = fs.readdirSync(`${path}/${folder}`)
      .filter((file) => file.endsWith('.js'))

    for (const file of files) {
      const filePath = `./events/client/${folder}/${file}`
      await delete require.cache[require.resolve(filePath)]
      const event = require(filePath)
      if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
      else client.on(event.name, (...args) => event.execute(...args, client))
    }
  }
  console.log('[+]'.green + ' Reloaded all client events')
}
module.exports = {
  loadClientInteractions,
  loadClientEvents
}