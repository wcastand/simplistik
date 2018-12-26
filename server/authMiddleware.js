const db = require('./db')
const jwt = require('jsonwebtoken')

async function authMiddleware(req, res, next) {
  const bearerToken = req.headers.authorization
  if (!bearerToken) return res.status(401).send('missing API Key')
  try {
    const token = bearerToken.replace('Bearer ', '')
    const verified = jwt.verify(token, process.env.secret)
    const authUser = await db('simplistik_user')
      .where('id', verified.id || null)
      .andWhere('username', verified.username || null)
      .then(rows => (rows.length === 1 ? rows[0] : null))

    if (authUser !== null) {
      req.jwt = authUser
      return next()
    } else {
      return res.status(401).send('invalid API Key in Authorization header')
    }
  } catch (err) {
    console.error(err)
    return res.status(401).send('invalid API Key in Authorization header')
  }
}

module.exports = authMiddleware
