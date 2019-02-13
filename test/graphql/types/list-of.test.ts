import { printType, GraphQLString, GraphQLObjectType, GraphQLID, GraphQLNonNull } from "graphql"
import { GraphQLListOf } from "../../../src/graphql/types/list-of"


const GraphQLUser = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
})

describe("testsuite graphql.types.list-of", () => {
  it("test print type", () => {
    expect(printType(GraphQLListOf(GraphQLString))).toEqual(`type ListOfString {
  totalCount: Int!
  nodes: [String!]!
}`)

    expect(printType(GraphQLListOf(GraphQLString, "StringList"))).toEqual(`type StringList {
  totalCount: Int!
  nodes: [String!]!
}`)

    expect(printType(GraphQLListOf(GraphQLUser))).toEqual(`type ListOfUser {
  totalCount: Int!
  nodes: [User!]!
}`)

    expect(printType(GraphQLListOf(GraphQLUser, "UserList"))).toEqual(`type UserList {
  totalCount: Int!
  nodes: [User!]!
}`)
  })
})
