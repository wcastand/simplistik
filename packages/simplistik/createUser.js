const jwt = require('jsonwebtoken')
const db = require('./db')

module.exports = async username => {
  try {
    const [id] = await db('simplistik_user')
      .returning('id')
      .insert({ username })

    const user = { id, username }
    const token = jwt.sign(user, process.env.secret || 'yoursecret')
    console.log(`Admin api_key is : ${token}`)
    console.log('Use it in the Authorization HTTP-Header :')
    console.log(`Bearer ${token}`)
  } catch (err) {
    console.error(err)
  }
}
