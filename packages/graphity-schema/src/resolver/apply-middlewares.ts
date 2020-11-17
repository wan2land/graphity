import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'

import { Middleware } from '../interfaces/middleware'

function execute<
  TSource,
  TContext,
  TArgs = Record<string, any>
>(
  parent: TSource,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
  middlewares: Middleware<TSource, TContext, TArgs>[],
  resolve: GraphQLFieldResolver<TSource, TContext, TArgs>
): Promise<any> {
  if (middlewares.length > 0) {
    const currentMiddleware = middlewares[0]
    const nextMiddlewares = middlewares.slice(1)
    return currentMiddleware.handle({ parent, args, context, info }, (next = {}) => {
      return execute(
        typeof next.parent === 'undefined' ? parent : next.parent,
        typeof next.args === 'undefined' ? args : next.args,
        typeof next.context === 'undefined' ? context : next.context,
        typeof next.info === 'undefined' ? info : next.info,
        nextMiddlewares,
        resolve
      )
    })
  }
  return resolve(parent, args, context, info)
}

export function applyMiddlewares<
  TSource,
  TContext,
  TArgs = Record<string, any>
>(
  middlewares: Middleware<TSource, TContext, TArgs>[],
  resolve: GraphQLFieldResolver<TSource, TContext, TArgs>
): GraphQLFieldResolver<TSource, TContext, TArgs> {
  if (middlewares.length === 0) {
    return resolve
  }
  return (parent, args, context, info) => {
    return execute<TSource, TContext, TArgs>(parent, args, context, info, middlewares, resolve)
  }
}
