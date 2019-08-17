import { GraphQLInputObjectType, GraphQLInt, GraphQLString } from 'graphql'

export const GraphQLInputPagination = new GraphQLInputObjectType({
  name: 'InputPagination',
  fields: {
    take: {
      type: GraphQLInt,
    },
    after: {
      type: GraphQLString,
    },
    offset: {
      type: GraphQLInt,
    },
  },
})
