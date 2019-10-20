import { GraphQLList, GraphQLNonNull, GraphQLNullableType } from 'graphql'

export function nonNullList(type: GraphQLNullableType) {
  return GraphQLNonNull(GraphQLList(GraphQLNonNull(type)))
}
