import { GraphQLError } from 'graphql'

export class GraphityError extends GraphQLError {
  public constructor(message: string, public code: string = 'UNKNOWN') {
    super(message)
    this.name = 'GraphityError'
  }
}
