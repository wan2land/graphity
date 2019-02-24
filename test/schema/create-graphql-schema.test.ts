import { printSchema, execute, parse } from "graphql"
import { createGraphQLSchema } from "../../src/schema/create-graphql-schema"
import { ArticleResolver } from "../stubs/resolvers/article-resolver"


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
      message: () => `expected ${type} to be ${expected}`,
      pass: false,
    }
  },
})

describe("testsuite create-graphql-schema", () => {
  it("test default schema", async () => {
    const schema = await createGraphQLSchema()
    const expector = expect(schema) as any
    expector.toGraphQLSchema(`
      type Query { }
    `)
  })

  it("test simple resolver", async () => {
    const schema = await createGraphQLSchema([
      ArticleResolver,
    ])
    const expector = expect(schema) as any
    expector.toGraphQLSchema(`
      type Article {
        id: ID!
        title: String!
      }

      type ListOfArticle {
        totalCount: Int!
        nodes: [Article!]!
      }

      type Mutation {
        createArticle(title: String!): Article
        updateArticle(id: ID!, title: String): Article
        deleteArticle(id: ID!): Article
      }

      type Query {
        article(id: ID!): Article
        articles(first: Int, after: String, offset: Int): ListOfArticle
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
})
