const { lexicographicSortSchema, printSchema } = require('graphql')

const originMatchers = global[Symbol.for('$$jest-matchers-object')].matchers

expect.extend({
  toEqualGraphQLSchema(received, expected) {
    return originMatchers.toEqual(
      printSchema(lexicographicSortSchema(received)).trim(),
      expected.trim(),
    )
  },
})
