require('dotenv').config()
const path = require('path')
const morgan = require('morgan')
const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const { fileLoader, mergeResolvers, mergeTypes } = require('merge-graphql-schemas')

const authMiddleware = require('./authMiddleware')
const typesArray = fileLoader(path.join(process.cwd(), './types'))
const resolversArray = fileLoader(path.join(process.cwd(), './resolvers'))

module.exports = (options = {}) => {
  const app = express()
  const typeDefs = mergeTypes(typesArray)
  const rootValue = mergeResolvers(resolversArray)

  const schema = buildSchema(typeDefs)
  const graphql = graphqlHTTP({
    schema,
    rootValue,
    ...options,
  })

  app.use(morgan('dev'))
  app.use('/', authMiddleware, graphql)

  return app
}
