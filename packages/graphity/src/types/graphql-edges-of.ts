import { GraphQLInt, GraphQLNamedType, GraphQLNonNull, GraphQLObjectType } from 'graphql'

import { GraphQLNonNullList } from './graphql-non-null-list'
import { GraphQLPageInfo } from './graphql-page-info'

export function GraphQLEdgesOf(type: GraphQLNamedType, name?: string) {
  return new GraphQLObjectType({
    name: name ? name : `EdgesOf${type.name}`,
    fields: {
      count: {
        type: GraphQLNonNull(GraphQLInt),
      },
      pageInfo: {
        type: GraphQLNonNull(GraphQLPageInfo),
      },
      edges: {
        type: GraphQLNonNullList(type),
      },
    },
  })
}
