const path = require('path')
const execa = require('execa')
const jwt = require('jsonwebtoken')
const db = require('../server/db')

module.exports = async username => {
  try {
    const [id] = await db('simplistik_user')
      .returning('id')
      .insert({ username })

    const user = { id, username }
    const token = jwt.sign(user, process.env.secret || 'yoursecret')
    console.log(user)
    console.log(`Admin api_key is : ${token}`)
    console.log('Use it in the Authorization HTTP-Header :')
    console.log('Authorization: Bearer <api_key>')
  } catch (err) {
    console.error(err)
  }
  process.exit()
}
