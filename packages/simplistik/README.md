# Simplistik

## basic idea : GraphQL PostgresSQL API package

Use knex for Postgres db setup.
Use express Graphql to graphql base.

## User should provide :

- knex config (db dev/prod config for knex)
- knex migrations
- graphql schema
- graphql resolvers

## Package should provide:

#### Commands

- knex migrations (make/run)
- knex seeds (make/run)
- create user/api_key
- delete user/api_key

## Command line

#### init

- create knex default config
- create default db.js
- create knex default migrations
- create knex default seeds
- create default graphql types
- create default graphql resovlers

#### migrate:make <name>

- create knex migration with <name>

#### migrate:latest

- migrate:latest from knex

#### seed:make <name>

- create knex seed with <name>

#### seed:run

- seed:run from knex

#### TODO : create-user (--mail, -m)

- create a user and print his api_key

#### TODO : delete-user (--mail, -m)

- delete the user from db

## Usage

```javascript
const simplistik = require('simplistik')

const api = simplistik(opts) // return express app
api.listen(process.env.PORT || 3001) // start server on $PORT or http://localhost:3001
```
