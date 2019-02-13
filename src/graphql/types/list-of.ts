import {
  GraphQLInt,
  GraphQLList,
  GraphQLNamedType,
  GraphQLNonNull,
  GraphQLObjectType
  } from "graphql"

export const GraphQLListOf = <P extends GraphQLNamedType>(type: P, name?: string) => {
  return new GraphQLObjectType({
    name: name ? name : `ListOf${type.name}`,
    fields: {
      totalCount: {
        type: GraphQLNonNull(GraphQLInt),
      },
      nodes: {
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(type))),
      },
    },
  })
}
