#!/usr/bin/env node
'use strict'
require('dotenv').config()
const meow = require('meow')
const path = require('path')
const execa = require('execa')

const init = require('./init')
const newUser = require('./new-user')

;(async () => {
  const cli = meow(
    `
    Usage
      $ simplistik <input>

    Options
      --username, -u Username for a new user, return an api_key

    Examples
      $ simplistik init
      $ simplistik new:user -u username
      $ simplistik start
  `,
    {
      booleanDefault: false,
      flags: {
        username: {
          type: 'string',
          alias: 'u',
        },
      },
    },
  )
  if (cli.input[0] === 'init') await init()
  else if (cli.input[0] === 'new:user') await newUser(cli.flags.username)
  else await require('simplistik').app()
})()
