import "jest"

import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"

import { createHttpHandler } from "../../src/restful/create-handler"

const GraphQLUser = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {type: GraphQLNonNull(GraphQLID)},
    name: {type: GraphQLNonNull(GraphQLString)},
  },
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      users: {
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLUser))),
        args: {
          take: {type: GraphQLInt},
          skip: {type: GraphQLInt},
        },
        resolve(_, args) {
          const take = args.take || 3
          const users = []
          for (let i = 0; i < take; i++) {
            const id = i + 1 + (args.skip || 0)
            users.push({id, name: `corgidisco${id}`})
          }
          return users
        },
      },
    },
  })
})

describe("testsuite of restful/create-handler", () => {
  it("test query", async () => {
    const handler = createHttpHandler(schema, "query", "users")
    expect(await handler({
      params: {},
      fields: [{name: "id", fields: []}]
    })).toEqual([
      {id: "1"},
      {id: "2"},
      {id: "3"},
    ])
  })

  it("test query with params", async () => {
    const handler = createHttpHandler(schema, "query", "users")
    expect(await handler({
      params: {skip: "5", take: "2"},
      fields: [{name: "id", fields: []}]
    })).toEqual([
      {id: "6"},
      {id: "7"},
    ])

    // wrong type, to null
    expect(await handler({
      params: {skip: "5", take: ""},
      fields: [{name: "id", fields: []}]
    })).toEqual([
      {id: "6"},
      {id: "7"},
      {id: "8"},
    ])
    expect(await handler({
      params: {skip: "5", take: {}},
      fields: [{name: "id", fields: []}]
    })).toEqual([
      {id: "6"},
      {id: "7"},
      {id: "8"},
    ])
    expect(await handler({
      params: {skip: "5", take: []},
      fields: [{name: "id", fields: []}]
    })).toEqual([
      {id: "6"},
      {id: "7"},
      {id: "8"},
    ])
  })
})
