//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//! DO NOT TOUCH THIS CODE UNLESS YOU KNOW WHAT YOU ARE DOING
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const chokidar = require('chokidar')
const { loadClientEvents, loadClientInteractions } = require('../../../register')
/**
 * @file Hot Reloading of Interactions and Events
 * @since 1.0.0
 * @version 2.0.0
*/
module.exports = {
  name: 'ready',
  once: true,
  /**
 * @description Executes the block of code when client is ready (bot initialization)
 * @param {Object} client Main Application Client
 */

  async execute (client) {
    chokidar.watch('./src/interactions', { ignored: /(^|[/\\])\../ })
      .on('all', (event, path) => {
        if (event === 'change') {
          loadClientInteractions(client, path)
        }
        if (event === 'unlink') {
          loadClientInteractions(client, path, true)
        }
        if (event === 'add') {
          loadClientInteractions(client, path)
        }
      })

    chokidar.watch('./src/events', { ignored: /(^|[/\\])\../ })
      .on('change', () => {
        loadClientEvents(client)
      })
  }
}