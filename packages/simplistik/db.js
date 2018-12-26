const { resolve } = require('path')
const environment = process.env.NODE_ENV || 'development'
const config = require(resolve(process.cwd(), './knexfile.js'))[environment]
module.exports = require('knex')(config)
