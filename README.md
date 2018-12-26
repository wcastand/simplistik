# Simplistik

## Getting Started

This tutorial will show how to use simplistik with sqlite(dev), postgres(production) on heroku.

```
$ mkdir dummy-project
$ cd dummy-project
$ yarn init
$ yarn add simplistik-cli pg sqlite3
$ yarn run knex init
$ yarn run simplistik init
```

Open the project in your editor and let's edit knexfile.js :

```javascript
// knexfile.js
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
```

The `process.env.DATABASE_URL` is specific to heroku, you'll need to adapt this part to your configuration and database stack.

Then go to [heroku](https://dashboard.heroku.com/apps), then :

- create a new project (or use the heroku cli).
- add addons:postgres
- in settings tab, add the config_vars :
  - secret = yoursecret
  - NODE_ENV = production

In the Config Vars you should see the `DATABASE_URL` from your postgres addons. Don't change it, we will use this value for `knexfile.js`

Once your heroku app is ready, comeback to your project.

Go to your package.json and add those scripts :

```json
// package.json
[...]
"scripts": {
  "postinstall": "knex migrate:latest",
  "start": "simplistik"
},
[...]
```

If you're using seeds, change `postinstall` script to `knex migrate:latest && knex seed:run`

You are now ready to push your app to heroku, add heroku as a git remote by following the step from heroku Deploy tab and push your app.

`git push heroku master`

Your app should be uploaded to heroku and start after runnning the migrations.

Before being able to use your graphql api you need to create a user and get an api_key.
To create an user use this command : `heroku run simplistik new:user -u <username>`

The command should create the user in your DB and print an api_key in the console.

#### Use the graphQL api

The easiest way to test your api is to use [GraphiQL App](https://github.com/skevy/graphiql-app)
Once the app is open :

- Change the url to your graphql api "http://<heroku-url>/graphql"
- `Authorization` : `Bearer <api_key>`

To test the api, you can use this query :

```
{
  user(id: "1") {
    username
    id
  }
}

```

the api should return :

```
{
  "data": {
    "user": {
      "username": <your username>,
      "id": "1"
    }
  }
}
```

## CLI

#### init

- create default db.js
- create knex default migrations
- create knex default seeds directory
- create default graphql types
- create default graphql resolvers

#### new:user (--username, -u)

- create a user and print his api_key

#### TODO : delete-user (--mail, -m)

- delete the user from db
