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

- knex migrations
- knex seeds
- create api_key
- delete api_key

## Command line

#### init

- create knex default config
- create knex default migrations for user auth and api_key

#### create-key (--mail, -m)

- create a user and print his api_key

#### delete-key (--mail, -m)

- delete the user and his api_key from db

## Usage

```js
const simplistik = require('simplistik')

const api = simplistik(schema, resolvers, opts)
api.start()

// start server on $PORT or http://localhost:3000
```
