import { ApolloServer } from 'apollo-server'
// import { schema } from './gqlSchema'
import {pothosSchema} from "./gqlSchemaPothos";
import { writeFileSync } from 'fs';
import { printSchema, lexicographicSortSchema } from 'graphql'

const schema = pothosSchema;
const schemaAsString = printSchema(lexicographicSortSchema(schema));
writeFileSync('schema.graphql', schemaAsString);

// export const server = new ApolloServer({ schema }) // Nexus schema
export const server = new ApolloServer({ schema: pothosSchema }) // Pothos schema