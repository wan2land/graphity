import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString, printType } from "graphql"

import { GraphQLEdgesOf } from "../../lib/types/graphql-edges-of"


const GraphQLUser = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
})

describe("testsuite of types/graphql-edges-of", () => {
  it("test print type", () => {
    expect(printType(GraphQLEdgesOf(GraphQLString))).toEqual(`type EdgesOfString {
  count: Int!
  pageInfo: PageInfo!
  edges: [String!]!
}`)

    expect(printType(GraphQLEdgesOf(GraphQLString, "StringEdges"))).toEqual(`type StringEdges {
  count: Int!
  pageInfo: PageInfo!
  edges: [String!]!
}`)

    expect(printType(GraphQLEdgesOf(GraphQLUser))).toEqual(`type EdgesOfUser {
  count: Int!
  pageInfo: PageInfo!
  edges: [User!]!
}`)

    expect(printType(GraphQLEdgesOf(GraphQLUser, "UserEdges"))).toEqual(`type UserEdges {
  count: Int!
  pageInfo: PageInfo!
  edges: [User!]!
}`)
  })
})
