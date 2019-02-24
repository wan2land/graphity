import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLString
  } from "graphql"

export const GraphQLInputPagination = new GraphQLInputObjectType({
  name: "InputPagination",
  fields: {
    first: {
      type: GraphQLInt,
    },
    after: {
      type: GraphQLString,
    },
    offset: {
      type: GraphQLInt,
    },
  },
})
