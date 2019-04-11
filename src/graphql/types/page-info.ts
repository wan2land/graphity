import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"

export const GraphQLPageInfo = new GraphQLObjectType({
  name: `PageInfo`,
  fields: {
    endCursor: {
      type: GraphQLString,
    },
    hasNextPage: {
      type: GraphQLNonNull(GraphQLBoolean),
    },
  },
})
