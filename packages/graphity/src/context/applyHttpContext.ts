
import { Graphity } from '../foundation/Graphity'
import { AuthBuilder } from '../interfaces/auth'
import { GraphityContext, HttpRequest } from '../interfaces/graphity'
import { PubSub } from '../interfaces/subscriptions'
import { toLowerCaseKey } from '../utils/toLowerCaseKey'


export function applyHttpContext(graphity: Graphity, request: HttpRequest, pubsub?: PubSub): Promise<GraphityContext> {
  const httpHeaders = toLowerCaseKey(request.headers)
  const authorization = httpHeaders.authorization
  let accessToken = null as string | null
  if (authorization) {
    const [_, token] = (Array.isArray(authorization) ? authorization[0] : authorization).split(/^bearer\s+/i)
    accessToken = token || null
  }
  return graphity.boot()
    .then(() => {
      if (graphity.container.has(AuthBuilder)) {
        return graphity.container.get(AuthBuilder).buildAuth(accessToken)
      }
      return Promise.resolve({ roles: [] })
    })
    .then((auth): GraphityContext => {
      return {
        $request: request,
        $container: graphity.container,
        $auth: auth,
        $pubsub: pubsub,
      }
    })
}
