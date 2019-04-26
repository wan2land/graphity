import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"

export const GraphQLJwtToken = new GraphQLObjectType({
  name: "JwtToken",
  fields: {
    token: {type: GraphQLNonNull(GraphQLString)},
    refreshToken: {type: GraphQLString}, // optional
  },
})
