/**
 * @file Ready Event File.
 * @since 1.0.0
*/

module.exports = {
  name: 'ready',
  once: true,

  /**
   * @description Executes the block of code when client is ready (bot initialization)
   * @param {Object} client Main Application Client
   */

  async execute (client) {
    //? Console log ready
    console.log('\x1b[36m%s\x1b[0m', `Ready! Logged in as ${client.user.tag}!\n`)
  }
}