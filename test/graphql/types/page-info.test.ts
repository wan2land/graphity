import { printType } from "graphql"

import { GraphQLPageInfo } from "../../../lib/graphql/types/page-info"


describe("testsuite graphql.types.page-info", () => {
  it("test print type", () => {
    expect(printType(GraphQLPageInfo)).toEqual(`type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
}`)
  })
})
