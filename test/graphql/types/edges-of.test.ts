import { printType, GraphQLString, GraphQLObjectType, GraphQLID, GraphQLNonNull } from "graphql"
import { GraphQLEdgesOf } from "../../../src/graphql/types/edges-of"


const GraphQLUser = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
})

describe("testsuite graphql.types.edges-of", () => {
  it("test print type", () => {
    expect(printType(GraphQLEdgesOf(GraphQLString))).toEqual(`type EdgesOfString {
  totalCount: Int!
  pageInfo: PageInfo!
  edges: [NodeOfString!]!
}`)

    expect(printType(GraphQLEdgesOf(GraphQLString, "StringEdges"))).toEqual(`type StringEdges {
  totalCount: Int!
  pageInfo: PageInfo!
  edges: [NodeOfString!]!
}`)

    expect(printType(GraphQLEdgesOf(GraphQLUser))).toEqual(`type EdgesOfUser {
  totalCount: Int!
  pageInfo: PageInfo!
  edges: [NodeOfUser!]!
}`)

    expect(printType(GraphQLEdgesOf(GraphQLUser, "UserEdges"))).toEqual(`type UserEdges {
  totalCount: Int!
  pageInfo: PageInfo!
  edges: [NodeOfUser!]!
}`)
  })
})
