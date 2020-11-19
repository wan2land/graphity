import { IncomingHttpHeaders } from 'http'

export interface HttpRequest {
  host?: string
  method: string
  headers: IncomingHttpHeaders
  path: string
  query: Record<string, any>
}

export interface ContextBuilder<TContext> {
  buildContext(request: HttpRequest): Promise<TContext>
}

export type ContextBuilderClass<TContext> = new (...args: any[]) => ContextBuilder<TContext>
