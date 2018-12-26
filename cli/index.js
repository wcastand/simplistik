#!/usr/bin/env node
'use strict'
require('dotenv').config()
const meow = require('meow')
const path = require('path')
const execa = require('execa')

const init = require('./init')

const knex_path = path.resolve(__dirname, '../node_modules/.bin/knex')
const cli = meow(
  `
	Usage
	  $ simplistik <input>

	Examples
		$ simplistik init
		$ simplistik migrate:make products_migration
		$ simplistik migrate:latest
		$ simplistik seed:make products_seed
		$ simplistik seed:run
`,
)

switch (cli.input[0]) {
  case 'init':
    init()
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
  default:
    console.error('No command found.')
    break
}
