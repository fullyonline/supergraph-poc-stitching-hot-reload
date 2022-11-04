import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql/type'

const Case = new GraphQLObjectType({
  name: 'Case',
  fields: {
    caseNumber: {
      type: GraphQLInt,
    },
    caseType: {
      type: GraphQLString,
    },
  },
})

const RootType = new GraphQLObjectType({
  name: 'RootType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        console.log('cases - hello')
        return 'Hello World'
      },
    },
    cases: {
      type: new GraphQLList(Case),
      resolve() {
        console.log('cases - caseNumbers')
        return [
          { caseNumber: 1234, caseType: 'ambulant' },
          { caseNumber: 2345, caseType: 'ambulant' },
          { caseNumber: 3456, caseType: 'stationaer' },
        ]
      },
    },
  },
})

export const schema = new GraphQLSchema({ query: RootType })
