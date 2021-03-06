import 'reflect-metadata'
import express from 'express'
import { dbConnect, dbDisconnect } from './database/database'
import { ApolloServer } from 'apollo-server-express'
import graphqlSchema from './graphql/composer'
import { __prod__, __express_timeout_time__ } from './constants'
import timeout from 'connect-timeout'

const main = async () => {
  const app = express()
  app.set('proxy', 1)
  app.use(timeout(__express_timeout_time__))

  dbConnect()

  const apolloServer = new ApolloServer({
    schema: graphqlSchema,
    debug: !__prod__,
    introspection: true,
    playground: true,
  })
  apolloServer.applyMiddleware({ app })

  app.listen(parseInt(process.env.SERVER_PORT), () => {
    console.log(`Server started on port ${process.env.SERVER_PORT}`)
  })
}

main().catch(err => {
  dbDisconnect()
  console.error(err)
})
