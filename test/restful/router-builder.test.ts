import "jest"

import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"

import { RouterBuilder } from "../../src/restful/router-builder"


describe("testsuite of restful/router-builder", () => {

  const builder = new RouterBuilder()

  it("test query", () => {
    const GraphQLUser = new GraphQLObjectType({
      name: "User",
      fields: {
        id: {type: GraphQLNonNull(GraphQLID)},
      },
    })
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: {
          version: {type: GraphQLString},
          users: {type: GraphQLNonNull(GraphQLList(GraphQLUser))},
        },
      }),
    })

    expect(builder.buildRouterSchema(schema)).toEqual([
      {method: "GET", path: "version"},
      {method: "GET", path: "users"},
    ])
  })

  it("test mutation", () => {
    const GraphQLUser = new GraphQLObjectType({
      name: "User",
      fields: {
        id: {type: GraphQLNonNull(GraphQLID)},
      },
    })
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: {
          version: {type: GraphQLString},
        },
      }),
      mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: {
          createUser: {type: GraphQLNonNull(GraphQLList(GraphQLUser))},
        },
      }),
    })

    expect(builder.buildRouterSchema(schema)).toEqual([
      {method: "GET", path: "version"},
      {method: "POST", path: "create-user"},
    ])
  })
})
