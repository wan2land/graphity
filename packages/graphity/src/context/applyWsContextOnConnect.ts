
import { AuthBuilder } from '../auth/AuthBuilder'
import { Graphity } from '../foundation/Graphity'
import { GraphityContext } from '../interfaces/graphity'
import { PubSub } from '../interfaces/subscriptions'


export function applyWsContextOnConnect(graphity: Graphity, accessToken: string, pubsub?: PubSub): Promise<GraphityContext> {
  return graphity.boot()
    .then(() => {
      if (graphity.container.has(AuthBuilder as any)) {
        return graphity.container.get<AuthBuilder>(AuthBuilder as any).buildAuth(accessToken)
      }
      return Promise.resolve({ roles: [] })
    })
    .then((auth): GraphityContext => {
      return {
        $container: graphity.container,
        $auth: auth,
        $pubsub: pubsub,
      }
    })
}
