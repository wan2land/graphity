import { printType } from "graphql"
import { createGraphQLObjectType } from "../../src/schema/create-graphql-object-type"
import { Article } from "../stubs/entities/article"

class UndefinedEntity {}

expect.extend({
  toGraphQLType(received, expected: string) {
    const type = printType(received).replace(/\s+/g, " ").trim()
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

describe("testsuite create-graphql-object-type", () => {
  it("test create type", async () => {
    const schema = await createGraphQLObjectType(Article)
    const expector = expect(schema) as any
    expector.toGraphQLType(`type Article {
      id: ID!
      title: String!
    }`)
  })

  it("test undefined entity type", async () => {
    const schema = await createGraphQLObjectType(UndefinedEntity)
    const expector = expect(schema) as any
    expector.toGraphQLType(`type UndefinedEntity {
    }`)
  })
})
