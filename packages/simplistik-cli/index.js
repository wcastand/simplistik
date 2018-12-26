#!/usr/bin/env node
'use strict'
require('dotenv').config()
const meow = require('meow')
const path = require('path')
const execa = require('execa')
const { server } = require('simplistik')

const init = require('./init')
const newUser = require('./new-user')

const cli = meow(
  `
	Usage
    $ simplistik <input>

  Options
    --username, -u Username for a new user, return an api_key

	Examples
		$ simplistik init
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

if (cli.input[0] === 'init') init()
else if (cli.input[0] === 'new:user') newUser(cli.flags.username)
else server()

process.exit()
