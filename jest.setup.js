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
  toEqualError(received, Ctor, data) {
    if (received.constructor !== Ctor) {
      return {
        pass: false,
        message: () => [
          `Expected constructor: ${this.utils.EXPECTED_COLOR(Ctor.name || '(anonymouse class)')}`,
          `Received constructor: ${this.utils.RECEIVED_COLOR(received.constructor.name)}`,
        ].join('\n'),
      }
    }

    for (const [key, value] of Object.entries(data || {})) {
      if (received[key] !== value) {
        return {
          pass: false,
          message: () => [
            `Expected property ${key}: ${this.utils.EXPECTED_COLOR(this.utils.stringify(value))}`,
            `Received property ${key}: ${this.utils.RECEIVED_COLOR(this.utils.stringify(received[key]))}`,
          ].join('\n'),
        }
      }
    }

    return {
      pass: true,
      message: () => '',
    }
  },
})
