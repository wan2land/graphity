
declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualGraphQLSchema(expected: string): R
      toEqualGraphQLType(expected: string): R
    }
  }
}

export {}
