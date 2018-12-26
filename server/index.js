require('dotenv').config()
const path = require('path')
const morgan = require('morgan')
const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const { fileLoader, mergeResolvers, mergeTypes } = require('merge-graphql-schemas')

const authMiddleware = require('./authMiddleware')

module.exports = (options = {}) => {
  const app = express()
  const typesArray = fileLoader(path.join(process.cwd(), './types'))
  const resolversArray = fileLoader(path.join(process.cwd(), './resolvers'))

  const typeDefs = mergeTypes(typesArray)
  const rootValue = mergeResolvers(resolversArray)
  const schema = buildSchema(typeDefs)

  const graphql = graphqlHTTP({
    schema,
    rootValue,
    ...options,
  })

  app.use(morgan('dev'))
  app.use('/graphql', authMiddleware, graphql)

  app.listen(process.env.PORT || 3001)
  console.log(`listen on ${process.env.PORT || 3001}`)

  return app
}
