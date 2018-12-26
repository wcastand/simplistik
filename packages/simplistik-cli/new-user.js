const { createUser } = require('simplistik')
module.exports = username => {
  if (!username) {
    console.error('A username needs to be provided. (-u)')
    process.exit()
  }
  createUser(username)
}
