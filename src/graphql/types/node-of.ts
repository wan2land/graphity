import { GraphQLNamedType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"

export const GraphQLNodeOf = <P extends GraphQLNamedType>(type: P, name?: string) => {
  return new GraphQLObjectType({
    name: name ? name : `NodeOf${type.name}`,
    fields: {
      cursor: {
        type: GraphQLNonNull(GraphQLString),
      },
      node: {
        type: GraphQLNonNull(type),
      },
    },
  })
}
