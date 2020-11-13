const { lexicographicSortSchema, printSchema, printType, isObjectType, isInputObjectType } = require('graphql')

const originMatchers = global[Symbol.for('$$jest-matchers-object')].matchers

function normalizeGraphQL(gql) {
  gql = gql.trim()

  const lines = gql.split('\n')
  const indents = lines.filter(line => line.trim().length).map(line => {
    const match = line.match(/^\s+/)
    return match ? match[0].length : 0
  })
  if (indents.length < 2) {
    return gql.trim()
  }
  const minIndent = Math.min(...indents.slice(1))
  return lines.map((line, lineIndex) => lineIndex > 0 ? line.slice(minIndent) : line).join('\n')
}

expect.extend({
  toEqualGraphQLSchema(received, expected) {
    return originMatchers.toEqual(
      normalizeGraphQL(printSchema(lexicographicSortSchema(received))),
      normalizeGraphQL(expected)
    )
  },
  toEqualGraphQLType(received, expected) {
    return originMatchers.toEqual(
      normalizeGraphQL(isObjectType(received) || isInputObjectType(received) ? printType(received) : received.toString()),
      normalizeGraphQL(expected)
    )
  },
})
