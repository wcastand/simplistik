const fs = require('fs')
const path = require('path')

const knex_migration_dir = path.resolve(process.cwd(), './migrations')
const knex_seeds_dir = path.resolve(process.cwd(), './seeds')
const graphql_types_dir = path.resolve(process.cwd(), './types')
const graphql_resolvers_dir = path.resolve(process.cwd(), './resolvers')

// From knex
// Ensure that we have 2 places for each of the date segments.
function padDate(segment) {
  segment = segment.toString()
  return segment[1] ? segment : `0${segment}`
}

// Get a date object in the correct format, without requiring a full out library
// like "moment.js".
function yyyymmddhhmmss() {
  const d = new Date()
  return (
    d.getFullYear().toString() +
    padDate(d.getMonth() + 1) +
    padDate(d.getDate()) +
    padDate(d.getHours()) +
    padDate(d.getMinutes()) +
    padDate(d.getSeconds())
  )
}

// coming from migration knex
const createMigrationName = name => {
  if (name[0] === '-') name = name.slice(1)
  return yyyymmddhhmmss() + '_' + name + '.js'
}

function createSimplistikMigration() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(knex_migration_dir)) {
      fs.mkdirSync(knex_migration_dir)
      console.info(`Knex migrations directory created at '${knex_migration_dir}'`)
    }

    const user_migration_file = path.resolve(
      knex_migration_dir,
      createMigrationName('simplistik_user'),
    )
    const user_migration_content = `exports.up = (knex, Promise) => knex.schema.createTable('simplistik_user', table => {
      table.increments('id').primary()
      table.string('username').unique()
    })
    exports.down = (knex, Promise) => knex.schema.dropTable('simplistik_user');
    `
    fs.writeFileSync(user_migration_file, user_migration_content, 'utf-8')
    return resolve()
  })
}

function createSimplistikSeed(createDefaultUser = false) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(knex_seeds_dir)) {
      fs.mkdirSync(knex_seeds_dir)
      console.info(`Knex seeds directory created at '${knex_seeds_dir}'`)
    }
    return resolve()
  })
}

function createSchemaGraphQL() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(graphql_types_dir)) {
      fs.mkdirSync(graphql_types_dir)
      console.info(`GraphQL types directory created at '${graphql_types_dir}'`)
    }
    const simplistik_user_types = path.resolve(graphql_types_dir, 'userType.js')
    const simplistik_user_types_content = `module.exports = \`
    type User {
      id: String
      username: String
    }
    type Query {
      user(id: String): User
    }
    \`
    `
    fs.writeFileSync(simplistik_user_types, simplistik_user_types_content, 'utf-8')

    return resolve()
  })
}

function createResolversGraphQL() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(graphql_resolvers_dir)) {
      fs.mkdirSync(graphql_resolvers_dir)
      console.info(`GraphQL resolvers directory created at '${graphql_resolvers_dir}'`)
    }
    const simplistik_user_resolvers = path.resolve(graphql_resolvers_dir, 'userResolver.js')
    const simplistik_user_resolvers_content = `const db = require('../db')
    module.exports = {
      user: ({ id }) =>
        db('simplistik_user')
          .where('id', id)
          .then(rows => rows[0]),
    }
    `
    fs.writeFileSync(simplistik_user_resolvers, simplistik_user_resolvers_content, 'utf-8')

    return resolve()
  })
}

function createDBFile() {
  return new Promise((resolve, reject) => {
    const db_path = path.resolve(process.cwd(), 'db.js')
    const db_content = `require('dotenv').config()
    const { resolve } = require('path')
    const environment = process.env.NODE_ENV || 'development'
    const config = require(resolve(process.cwd(), './knexfile.js'))[environment]
    module.exports = require('knex')(config)
    `
    fs.writeFileSync(db_path, db_content, 'utf-8')

    return resolve()
  })
}

module.exports = {
  createSimplistikMigration,
  createSimplistikSeed,
  createSchemaGraphQL,
  createResolversGraphQL,
  createDBFile,
}
