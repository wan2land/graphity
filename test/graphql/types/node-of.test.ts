import { printType, GraphQLString, GraphQLObjectType, GraphQLID, GraphQLNonNull } from "graphql"
import { GraphQLNodeOf } from "../../../src/graphql/types/node-of"


const GraphQLUser = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
})

describe("testsuite graphql.types.node-of", () => {
  it("test print type", () => {
    expect(printType(GraphQLNodeOf(GraphQLString))).toEqual(`type NodeOfString {
  cursor: String!
  node: String!
}`)

    expect(printType(GraphQLNodeOf(GraphQLString, "StringNode"))).toEqual(`type StringNode {
  cursor: String!
  node: String!
}`)

    expect(printType(GraphQLNodeOf(GraphQLUser))).toEqual(`type NodeOfUser {
  cursor: String!
  node: User!
}`)

    expect(printType(GraphQLNodeOf(GraphQLUser, "UserNode"))).toEqual(`type UserNode {
  cursor: String!
  node: User!
}`)
  })
})
