const { createUser } = require('simplistik')
module.exports = async username => {
  if (!username) {
    console.error('A username needs to be provided. (-u)')
    process.exit()
  }
  await createUser(username)
  process.exit()
}
