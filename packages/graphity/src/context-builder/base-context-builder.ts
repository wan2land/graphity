import { ContextBuilder, HttpRequest } from '../interfaces/graphql'


export class BaseContextBuilder<TContext> implements ContextBuilder<TContext> {

  buildHttpContext(request: HttpRequest, ctx: any): Promise<TContext> {
    return this.buildContext(request, ctx)
  }

  buildWsContext(request: HttpRequest, ctx: any): Promise<TContext> {
    return this.buildContext(request, ctx)
  }

  buildContext(request: HttpRequest, ctx: any): Promise<TContext> {
    throw new Error('It must be implemented.')
  }
}
