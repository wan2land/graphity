const { lexicographicSortSchema, printSchema, printType } = require('graphql')

const originMatchers = global[Symbol.for('$$jest-matchers-object')].matchers

expect.extend({
  toEqualGraphQLSchema(received, expected) {
    return originMatchers.toEqual(
      printSchema(lexicographicSortSchema(received)).trim(),
      expected.trim(),
    )
  },
  toEqualGraphQLType(received, expected) {
    const lines = expected.trim().split('\n')
    const indents = lines.map(line => {
      const match = line.match(/^\s+/)
      return match ? match[0].length : 0
    })
    const minIndent = Math.min(...indents.slice(1))

    return originMatchers.toEqual(
      printType(received).trim(),
      lines.map((line, lineIndex) => lineIndex > 0 ? line.slice(minIndent) : line).join('\n'),
    )
  },
})
