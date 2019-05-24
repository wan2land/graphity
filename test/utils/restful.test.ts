import "jest"

import { parseQueryFields } from "../../src/utils/restful"


describe("testsuite of utils/restful", () => {
  it("test parseQueryFields", () => {
    expect(parseQueryFields([])).toEqual([])

    expect(parseQueryFields(["foo"])).toEqual([{name: "foo", fields: []}])
    expect(parseQueryFields(["...foo..."])).toEqual([{name: "foo", fields: []}])

    expect(parseQueryFields(["foo", "foo", "foo"])).toEqual([{name: "foo", fields: []}])
    expect(parseQueryFields(["foo", "...foo..."])).toEqual([{name: "foo", fields: []}])
    expect(parseQueryFields(["...foo...", "...foo..."])).toEqual([{name: "foo", fields: []}])

    expect(parseQueryFields(["foo.bar"])).toEqual([{name: "foo", fields: [{name: "bar", fields: []}]}])
    expect(parseQueryFields(["...foo...bar..."])).toEqual([{name: "foo", fields: [{name: "bar", fields: []}]}])
    expect(parseQueryFields(["...foo...bar...", "...foo...bar..."])).toEqual([{name: "foo", fields: [{name: "bar", fields: []}]}])

    expect(parseQueryFields(["foo.bar", "foo.baz"])).toEqual([
      {name: "foo", fields: [
        {name: "bar", fields: []},
        {name: "baz", fields: []}
      ]}
    ])
    expect(parseQueryFields(["foo...bar", "...foo...baz...", "...foo...baz..."])).toEqual([
      {name: "foo", fields: [
        {name: "bar", fields: []},
        {name: "baz", fields: []}
      ]}
    ])
  })
})
