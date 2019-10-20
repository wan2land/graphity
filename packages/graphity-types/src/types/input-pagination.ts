import { GraphQLInputObjectType, GraphQLInt } from 'graphql'

export const GraphQLInputPagination = new GraphQLInputObjectType({
  name: 'InputPagination',
  fields: {
    take: { type: GraphQLInt },
    offset: { type: GraphQLInt },
  },
})
