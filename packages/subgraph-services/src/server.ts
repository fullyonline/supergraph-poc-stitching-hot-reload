import { createServer } from '@graphql-yoga/node';
import { schema } from './gqlSchema';
import { writeFileSync } from 'fs';
import { printSchema, lexicographicSortSchema } from 'graphql'

const schemaAsString = printSchema(lexicographicSortSchema(schema));
writeFileSync('schema.graphql', schemaAsString);

const server = createServer({
  schema: schema,
  port: 4100
});

server.logger.info('Starting GraphQL-Yoga Server for subgraph-services')
server.start();