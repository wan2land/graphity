import { printType } from "graphql"
import { createGraphQLObjectTypeFactory } from "../../src/schema/create-graphql-object-type-factory"
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

describe("testsuite entity.create-graphql-object-type-factory", () => {
  it("test create type factory", async () => {
    const schema = createGraphQLObjectTypeFactory(Article).factory()
    const expector = expect(schema) as any
    expector.toGraphQLType(`
      """article entity"""
      type Article {
        """article id"""
        id: ID!
        title: String!
        contents: String
      }
    `)
  })

  it("test undefined entity type factory", async () => {
    const schema = createGraphQLObjectTypeFactory(UndefinedEntity).factory()
    const expector = expect(schema) as any
    expector.toGraphQLType(`type UndefinedEntity {
    }`)
  })
})
