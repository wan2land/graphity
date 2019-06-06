import { printSchema, printType } from "graphql"

declare global {
  namespace jest {
    interface Matchers<R> {
      toGraphQLSchema: (expected: string) => CustomMatcherResult
      toGraphQLType: (expected: string) => CustomMatcherResult
    }
  }
}

expect.extend({
  toGraphQLSchema(received, expected: string) {
    const type = printSchema(received).replace(/\s+/g, " ").trim()
    const escapeExpected = expected.replace(/\s+/g, " ").trim()
    if (type === escapeExpected) {
      return {
        message: () => "success",
        pass: true,
      }
    }
    return {
      message: () => `expected \`${type}\` to be \`${escapeExpected}\``,
      pass: false,
    }
  },
})

expect.extend({
  toGraphQLType(received, expected: string) {
    const type = printType(received).replace(/\s+/g, " ").trim()
    const escapeExpected = expected.replace(/\s+/g, " ").trim()
    if (type === escapeExpected) {
      return {
        message: () => "success",
        pass: true,
      }
    }
    return {
      message: () => `expected \`${type}\` to be \`${escapeExpected}\``,
      pass: false,
    }
  },
})

