import { server } from './server'

// Apollo Server
/*
server.listen().then(({ url }) => {
  console.log(`💫 Starting Apollo GraphQL Server for subgraph-patients`)
  console.log(`🚀 Server ready at ${url}`)
})
 */

// Express Server

import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { pothosSchema } from "./gqlSchemaPothos";

const port = 4000
const path = '/graphql'
// const schema = pothosSchema;

// const schemaAsString = printSchema(lexicographicSortSchema(schema));
// writeFileSync('schema.graphql', schemaAsString);

var app = express();
app.use(
    path,
    graphqlHTTP({
      schema: pothosSchema,
      graphiql: true,
    }),
)
app.listen(port);
console.log('🚄 Starting Express GraphQL Server for subgraph-cases')
console.log(`🚀 Server ready at http://localhost:${port}${path}`)