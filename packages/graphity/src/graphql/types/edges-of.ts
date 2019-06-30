import { GraphQLInt, GraphQLNamedType, GraphQLNonNull, GraphQLObjectType } from "graphql"

import { GraphQLNodeOf } from "./node-of"
import { GraphQLNonNullList } from "./non-null-list"
import { GraphQLPageInfo } from "./page-info"

export const GraphQLEdgesOf = <P extends GraphQLNamedType>(type: P, name?: string) => {
  return new GraphQLObjectType({
    name: name ? name : `EdgesOf${type.name}`,
    fields: {
      totalCount: {
        type: GraphQLNonNull(GraphQLInt),
      },
      pageInfo: {
        type: GraphQLNonNull(GraphQLPageInfo),
      },
      edges: {
        type: GraphQLNonNullList(GraphQLNodeOf(type)),
      },
    },
  })
}
