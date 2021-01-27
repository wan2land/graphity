
import { AuthBuilder } from '../auth/AuthBuilder'
import { Graphity } from '../foundation/Graphity'
import { GraphityContext, HttpRequest } from '../interfaces/graphity'
import { toLowerCaseKey } from '../utils/toLowerCaseKey'


export function applyHttpContext(graphity: Graphity, request: HttpRequest): Promise<GraphityContext> {
  const httpHeaders = toLowerCaseKey(request.headers)
  const authorization = httpHeaders.authorization
  let accessToken = null as string | null
  if (authorization) {
    const [_, token] = (Array.isArray(authorization) ? authorization[0] : authorization).split(/^bearer\s+/i)
    accessToken = token || null
  }
  return graphity.boot()
    .then(() => {
      if (graphity.container.has(AuthBuilder as any)) {
        return graphity.container.get<AuthBuilder>(AuthBuilder as any).buildAuth(accessToken)
      }
      return Promise.resolve({ roles: [] })
    })
    .then((auth): GraphityContext => {
      return {
        $request: request,
        $container: graphity.container,
        $auth: auth,
      }
    })
}
