import { execute, parse, printSchema } from "graphql"

import { createSchema } from "../../lib/schema/create-schema"
import { ArticleResolver } from "../stubs/resolvers/article-resolver"
import { HomeResolver } from "../stubs/resolvers/home-resolver"
import { UserResolver } from "../stubs/resolvers/user-resolver"


expect.extend({
  toGraphQLSchema(received, expected: string) {
    const type = printSchema(received).replace(/\s+/g, " ").trim()
    if (type === expected.replace(/\s+/g, " ").trim()) {
      return {
        message: () => "success",
        pass: true,
      }
    }

    return {
      message: () => `expected ${type} to be ${expected.replace(/\s+/g, " ").trim()}`,
      pass: false,
    }
  },
})

describe("testsuite create-graphql-schema", () => {
  it("test default schema", async () => {
    const schema = createSchema()
    const expector = expect(schema) as any
    expector.toGraphQLSchema(`
      type Query { }
    `)
  })

  it("test simple resolver", async () => {
    const schema = createSchema([
      ArticleResolver,
      HomeResolver,
    ])
    // schema.
    const expector = expect(schema) as any
    expector.toGraphQLSchema(`
      """article entity"""
      type Article {
        """article id"""
        id: ID!
        title: String!
        contents: String
      }

      type ListOfArticle {
        totalCount: Int!
        nodes: [Article!]!
      }

      type Mutation {
        """this is createArticle"""
        createArticle(title: String!): Article
        updateArticle(id: ID!, title: String): Article
        deleteArticle(id: ID!): Article
      }

      type Query {
        """this is article"""
        article(id: ID!): Article
        articles(first: Int, after: String, offset: Int): ListOfArticle

        version: String
      }
    `)

    expect(await execute({
      schema,
      document: parse(`query {
        article(id: "1") {
          id
          title
        }
        articles {
          totalCount
          nodes {
            id
            title
          }
        }
      }`),
    })).toEqual({
      data: {
        article: {
          id: "1",
          title: "this is 1"
        },
        articles: {
          totalCount: 1,
          nodes: [
            {
              id: "1",
              title: "this is 1",
            }
          ],
        },
      }
    })
  })

  it("test recursive resolver", async () => {
    const schema = await createSchema([
      UserResolver,
    ])
    const expector = expect(schema) as any
    expector.toGraphQLSchema(`
      type ListOfUser {
        totalCount: Int!
        nodes: [User!]!
      }

      type Query {
        user(id: ID!): User
      }

      type User {
        id: ID!
        name: String!
        users: ListOfUser!
      }
      `)

    expect(await execute({
      schema,
      document: parse(`query {
        user(id: "1") {
          id
          name
          users {
            totalCount
            nodes {
              id
              name
              users {
                totalCount
                nodes {
                  id
                  name
                }
              }  
            }
          }
        }
      }`),
    })).toEqual({
      data: {
        user: {
          id: "1",
          name: "name is 1",
          users: {
            totalCount: 2,
            nodes: [
              {
                id: "1_1",
                name: "name is 1_1",
                users: {
                  totalCount: 2,
                  nodes: [
                    {
                      id: "1_1_1",
                      name: "name is 1_1_1",
                    },
                    {
                      id: "1_1_2",
                      name: "name is 1_1_2",
                    },
                  ],
                },
              },
              {
                id: "1_2",
                name: "name is 1_2",
                users: {
                  totalCount: 2,
                  nodes: [
                    {
                      id: "1_2_1",
                      name: "name is 1_2_1",
                    },
                    {
                      id: "1_2_2",
                      name: "name is 1_2_2",
                    },
                  ],
                },
              },
            ],
          },
        },
      }
    })
  })
})
