import { Containable } from '@graphity/container'
import { IncomingHttpHeaders } from 'http'


import { GraphityAuth } from './auth'
import { PubSub } from './subscriptions'

export interface HttpRequest {
  host?: string
  method: string
  headers: IncomingHttpHeaders
  path: string
  query: Record<string, any>
}

export interface GraphityContext {
  $request?: HttpRequest
  $container: Containable
  $auth: GraphityAuth
  $pubsub?: PubSub
}
