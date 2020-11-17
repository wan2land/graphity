import { Container } from '@graphity/container'
import { IncomingHttpHeaders } from 'http'

import { GraphityAuth } from './auth'

export interface HttpRequest {
  host?: string
  method: string
  headers: IncomingHttpHeaders
  path: string
  query: Record<string, any>
}

export interface ContextBuilder {
  buildContext(request: HttpRequest): Promise<GraphityContext>
}

export type ContextBuilderClass = new (...args: any[]) => ContextBuilder


export interface AuthBuilder {
  buildAuth(request: HttpRequest): Promise<GraphityAuth | undefined>
}

export interface GraphityContext {
  request: HttpRequest
  container: Container
  auth?: GraphityAuth
  [name: string]: any
}
