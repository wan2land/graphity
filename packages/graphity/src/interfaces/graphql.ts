import { IncomingHttpHeaders } from 'http'

export interface HttpRequest {
  host?: string
  method: string
  headers: IncomingHttpHeaders
  path: string
  query: Record<string, any>
}

export interface ContextBuilder<TContext> {
  buildHttpContext(request: HttpRequest, context: any): Promise<TContext>
  buildWsContext(request: HttpRequest, context: any): Promise<TContext>
}

export type ContextBuilderClass<TContext> = new (...args: any[]) => ContextBuilder<TContext>
