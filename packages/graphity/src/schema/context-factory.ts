import { GraphQLAuthContext } from '../interfaces/auth'
import { HttpRequest } from '../interfaces/graphity'

export class ContextFactory {
  public factory(request: HttpRequest): Promise<GraphQLAuthContext> {
    return Promise.resolve({
      request,
      auth: {
        roles: [],
      },
    })
  }
}
