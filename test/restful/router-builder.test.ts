import "jest"

import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"

import { RouterBuilder } from "../../src/restful/router-builder"


describe("testsuite of restful/router-builder", () => {

  const builder = new RouterBuilder()
  const GraphQLUser = new GraphQLObjectType({
    name: "User",
    fields: {
      id: {type: GraphQLNonNull(GraphQLID)},
      name: {type: GraphQLNonNull(GraphQLString)},
    },
  })

  it("test query", () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: {
          version: {type: GraphQLString},
          users: {type: GraphQLNonNull(GraphQLList(GraphQLUser))},
          user: {
            type: GraphQLUser,
            args: {
              id: {type: GraphQLNonNull(GraphQLID)},
            },
          }
        },
      }),
    })

    expect(builder.buildRouterSchema(schema)).toEqual([
      {method: "GET", path: "version", handler: expect.any(Function)},
      {method: "GET", path: "users", handler: expect.any(Function)},
      {method: "GET", path: "user/:id", handler: expect.any(Function)},
    ])
  })

  it("test mutation", () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: {
          Version: {type: GraphQLString},
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
      {method: "GET", path: "version", handler: expect.any(Function)},
      {method: "POST", path: "create-user", handler: expect.any(Function)},
    ])
  })
})
