import { execute, parse, printSchema } from "graphql"

import { createSchema } from "../../lib/schema/create-schema"
import { ArticleResolver } from "../stubs/resolvers/article-resolver"
import { HomeResolver } from "../stubs/resolvers/home-resolver"
import { UserResolver } from "../stubs/resolvers/user-resolver"


describe("testsuite of schema/create-graphql-schema", () => {
  it("test default schema", async () => {
    const schema = createSchema()
    expect(printSchema(schema)).toEqual(`type Query
`)
  })

  it("test simple resolver", async () => {
    const schema = createSchema([
      ArticleResolver,
      HomeResolver,
    ])
    // schema.
    expect(printSchema(schema)).toEqual(`"""article entity"""
type Article {
  """article id"""
  id: ID!
  title: String!
  contents: String
}

type ListOfArticle {
  count: Int!
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
  articles(take: Int, after: String, offset: Int): ListOfArticle
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
          count
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
          count: 1,
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
    expect(printSchema(schema)).toEqual(`type ListOfUser {
  count: Int!
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
            count
            nodes {
              id
              name
              users {
                count
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
            count: 2,
            nodes: [
              {
                id: "1_1",
                name: "name is 1_1",
                users: {
                  count: 2,
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
                  count: 2,
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
