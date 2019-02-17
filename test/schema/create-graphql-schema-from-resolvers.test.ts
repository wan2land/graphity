import { printSchema, execute, parse } from "graphql"
import { createGraphQLSchemaFromResolvers } from "../../src/schema/create-graphql-schema-from-resolvers"
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

describe("testsuite create-graphql-schema-from-resolvers", () => {
  it("test default schema", async () => {
    const schema = await createGraphQLSchemaFromResolvers()
    const expector = expect(schema) as any
    expector.toGraphQLSchema(`
      type Query { }
    `)
  })

  it("test simple resolver", async () => {
    const schema = await createGraphQLSchemaFromResolvers([
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

      type Query {
        article: Article
        articles: ListOfArticle
      }
    `)

    expect(await execute({
      schema,
      document: parse(`query {
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
        articles: {
          totalCount: 1,
          nodes: [
            {
              id: "1",
              title: "hello world",
            }
          ],
        },
      }
    })
  })
})
