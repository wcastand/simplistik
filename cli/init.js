const fs = require('fs')
const path = require('path')
const execa = require('execa')
const jwt = require('jsonwebtoken')
const { createMigrationName } = require('./utils')

const knex_path = path.resolve(__dirname, '../node_modules/.bin/knex')
const knex_migration_dir = path.resolve(process.cwd(), './migrations')
const knex_seeds_dir = path.resolve(process.cwd(), './seeds')
const graphql_types_dir = path.resolve(process.cwd(), './types')
const graphql_resolvers_dir = path.resolve(process.cwd(), './resolvers')

const user_migration_content = `exports.up = (knex, Promise) => knex.schema.createTable('simplistik_user', table => {
    table.increments('id').primary()
    table.string('username')
  })
exports.down = (knex, Promise) => knex.schema.dropTable('simplistik_user');
`

const user_seed_content = `exports.seed = (knex, Promise) => knex('simplistik_user').del()
  .then(() => knex('simplistik_user').insert({username: 'admin'}))
`

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
    fs.writeFileSync(user_migration_file, user_migration_content, 'utf-8')
    return resolve()
  })
}

function createSimplistikSeed() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(knex_seeds_dir)) {
      fs.mkdirSync(knex_seeds_dir)
      console.info(`Knex seeds directory created at '${knex_seeds_dir}'`)
    }

    const user_seed_file = path.resolve(knex_seeds_dir, 'simplistik_user.js')
    fs.writeFileSync(user_seed_file, user_seed_content, 'utf-8')
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
    const environment = process.env.ENVIRONMENT || 'development'
    const config = require(resolve(process.cwd(), './knexfile.js'))[environment]
    module.exports = require('knex')(config)
    `
    fs.writeFileSync(db_path, db_content, 'utf-8')

    return resolve()
  })
}

module.exports = async () => {
  await execa.shell(`${knex_path} init`).then(() => console.info(`Knex config created.`))

  await createDBFile().then(() => console.info(`default DB file created.`))
  await createSchemaGraphQL().then(() => console.info(`GraphQL schemas file created.`))
  await createResolversGraphQL().then(() => console.info(`GraphQL resolvers file created.`))

  await createSimplistikMigration().then(() => console.info(`Knex migration file created.`))
  await createSimplistikSeed().then(() => console.info(`Knex seed file created.`))

  await execa.shell(`${knex_path} migrate:latest`).then(() => console.info(`migration OK.`))
  await execa.shell(`${knex_path} seed:run`).then(() => console.info(`seeding OK.`))

  const token = jwt.sign({ id: 1, username: 'admin' }, process.env.secret)
  console.log(`Admin token is : ${token}`)
  process.exit()
}
