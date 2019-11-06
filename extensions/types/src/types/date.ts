import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'
import { GraphQLScalarType } from 'graphql/type/definition'


const RE_DATE = /^\d{4}-\d{2}-\d{2}$/i

function validate(value: any) {
  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string: ${value}`)
  }

  if (!RE_DATE.test(value)) {
    throw new TypeError(`Value is not a valid Date: ${value}`)
  }

  return value
}

export const GraphQLDate = new GraphQLScalarType({
  name: 'Date',

  serialize(value) {
    return validate(value)
  },

  parseValue(value) {
    return validate(value)
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Can only validate strings as Dates but got a: ${ast.kind}`)
    }

    return validate(ast.value)
  },
})
