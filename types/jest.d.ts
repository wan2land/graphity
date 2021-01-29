
declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualGraphQLSchema(expected: string): R
      toEqualGraphQLType(expected: string): R
      toEqualError(expectedType: (new (...args: any[]) => any), expectedData?: Record<string, any>): R
    }
  }
}

export {}
