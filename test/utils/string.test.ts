import "jest"

import { toDashCase } from "../../src/utils/string"


describe("testsuite of utils/string", () => {
  it("test camelToDash", () => {
    expect(toDashCase("helloWorld")).toEqual("hello-world")
    expect(toDashCase("HelloWorld")).toEqual("hello-world")
    expect(toDashCase("hello-world")).toEqual("hello-world")
    expect(toDashCase("hello_world")).toEqual("hello-world")
    expect(toDashCase("hello.world")).toEqual("hello-world")

    expect(toDashCase("hello----world")).toEqual("hello-world")
    expect(toDashCase("hello____world")).toEqual("hello-world")
    expect(toDashCase("hello....world")).toEqual("hello-world")

    expect(toDashCase("hello-_.world")).toEqual("hello-world")
  })
})
