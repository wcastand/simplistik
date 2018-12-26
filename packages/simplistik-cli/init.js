const path = require('path')
const execa = require('execa')
const {
  createSimplistikMigration,
  createSimplistikSeed,
  createSchemaGraphQL,
  createResolversGraphQL,
  createDBFile,
} = require('./utils')

const knex_cli = path.resolve(process.cwd(), './node_modules/.bin/knex')

module.exports = async () => {
  await execa.shell(`${knex_cli} init`).then(() => console.info(`Knex config created.`))

  await createDBFile().then(() => console.info(`default DB file created.`))
  await createSchemaGraphQL().then(() => console.info(`GraphQL schemas file created.`))
  await createResolversGraphQL().then(() => console.info(`GraphQL resolvers file created.`))

  await createSimplistikMigration().then(() => console.info(`Knex migration file created.`))
  await createSimplistikSeed().then(() => console.info(`Knex seed file created.`))
}
