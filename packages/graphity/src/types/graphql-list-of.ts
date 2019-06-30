import { GraphQLInt, GraphQLNamedType, GraphQLNonNull, GraphQLObjectType } from "graphql"

import { GraphQLNonNullList } from "./graphql-non-null-list"

export function GraphQLListOf(type: GraphQLNamedType, name?: string) {
  return new GraphQLObjectType({
    name: name ? name : `ListOf${type.name}`,
    fields: {
      count: {
        type: GraphQLNonNull(GraphQLInt),
      },
      nodes: {
        type: GraphQLNonNullList(type),
      },
    },
  })
}
