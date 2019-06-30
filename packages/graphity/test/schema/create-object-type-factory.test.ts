import { printType } from "graphql"

import { createObjectTypeFactory } from "../../lib/schema/create-object-type-factory"
import { Article } from "../stubs/entities/article"


class UndefinedEntity {}

describe("testsuite of schema/create-object-type-factory", () => {
  it("test create type factory", async () => {
    const schema = createObjectTypeFactory(Article).factory()
    expect(printType(schema)).toEqual(`"""article entity"""
type Article {
  """article id"""
  id: ID!
  title: String!
  contents: String
}`)
  })

  it("test undefined entity type factory", async () => {
    const schema = createObjectTypeFactory(UndefinedEntity).factory()
    expect(printType(schema)).toEqual(`type UndefinedEntity`)
  })
})
