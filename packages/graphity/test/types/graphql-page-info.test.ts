import { printType } from "graphql"

import { GraphQLPageInfo } from "../../lib/types/graphql-page-info"


describe("testsuite of types/graphql-page-info", () => {
  it("test print type", () => {
    expect(printType(GraphQLPageInfo)).toEqual(`type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
}`)
  })
})
