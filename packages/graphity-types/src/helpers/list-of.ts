import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType } from 'graphql'

export function listOf(type: GraphQLScalarType | GraphQLObjectType, name?: string) {
  return new GraphQLObjectType({
    name: name ? name : `ListOf${type.name}`,
    fields: {
      count: { type: GraphQLNonNull(GraphQLInt) },
      nodes: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(type))) },
    },
  })
}
