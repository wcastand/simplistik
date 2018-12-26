const { resolve } = require('path')
const environment = process.env.ENVIRONMENT || 'development'
const config = require(resolve(process.cwd(), './knexfile.js'))[environment]
module.exports = require('knex')(config)
