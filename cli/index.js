#!/usr/bin/env node
'use strict'
require('dotenv').config()
const meow = require('meow')
const path = require('path')
const execa = require('execa')

const simplistik = require('../server')

const init = require('./init')
const createUser = require('./createUser')

const knex_path = path.resolve(__dirname, '../node_modules/.bin/knex')
const cli = meow(
  `
	Usage
    $ simplistik <input>

  Options
    --admin, -a Create a default user
    --username, -u Username for a new user

	Examples
		$ simplistik init -a
		$ simplistik migrate:make products_migration
		$ simplistik migrate:latest
		$ simplistik seed:make products_seed
    $ simplistik seed:run
    $ simplistik new:user -u username
    $ simplistik start
`,
  {
    booleanDefault: false,
    flags: {
      admin: {
        type: 'boolean',
        default: false,
        alias: 'a',
      },
      username: {
        type: 'string',
        alias: 'u',
      },
    },
  },
)

switch (cli.input[0]) {
  case 'init':
    init({ createDefaultUser: cli.flags.admin })
    break
  case 'migrate:make':
    execa(knex_path, ['migrate:make', cli.input[1]]).stdout.pipe(process.stdout)
    break
  case 'migrate:latest':
    execa(knex_path, ['migrate:latest']).stdout.pipe(process.stdout)
    break
  case 'seed:make':
    execa(knex_path, ['seed:make', cli.input[1]]).stdout.pipe(process.stdout)
    break
  case 'seed:run':
    execa(knex_path, ['seed:run']).stdout.pipe(process.stdout)
    break
  case 'new:user':
    if (!cli.flags.username) {
      console.error('A username needs to be provided. (-u)')
      process.exit()
    }
    createUser(cli.flags.username)
    break
  case 'start':
  default:
    simplistik()
    break
}
