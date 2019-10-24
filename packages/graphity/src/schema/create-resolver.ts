import { Container } from '@graphity/container'
import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'

import { Callable, ConstructType } from '../interfaces/common'
import { Middleware } from '../interfaces/graphity'

function executeResolver<TSource, TContext, TArgs = { [argName: string]: any }>(
  parent: TSource,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
  container: Container,
  middlewares: ConstructType<Middleware>[],
  resolver: ConstructType<any> | null,
  handler: Callable
): Promise<any> {
  if (middlewares.length > 0) {
    const firstMiddleware = container.instances.get(middlewares[0]) as Middleware
    const nextMiddlewares = middlewares.slice(1)
    return firstMiddleware.handle({ parent, args, context, info }, (next = {}) => {
      return executeResolver(
        typeof next.parent === 'undefined' ? parent : next.parent,
        typeof next.args === 'undefined' ? args : next.args,
        typeof next.context === 'undefined' ? context : next.context,
        typeof next.info === 'undefined' ? info : next.info,
        container,
        nextMiddlewares,
        resolver,
        handler
      )
    })
  }
  const resolveInstance = resolver && container.instances.get(resolver) || null
  return resolveInstance
    ? handler.call(resolveInstance, parent, args, context, info)
    : handler(parent, args, context, info)
}

export function createResolver<TSource, TContext, TArgs = Record<string, any>>(
  container: Container,
  middlewares: ConstructType<Middleware>[],
  resolver: ConstructType<any> | null,
  handler: Callable
): GraphQLFieldResolver<TSource, TContext, TArgs> {
  if (middlewares.length === 0) {
    const resolveInstance = resolver && container.instances.get(resolver) || null
    return (parent, args, context, info) => resolveInstance
      ? handler.call(resolveInstance, parent, args, context, info)
      : handler(parent, args, context, info)
  }
  return (parent, args, context, info) => {
    return executeResolver<TSource, TContext, TArgs>(
      parent,
      args,
      context,
      info,
      container,
      middlewares,
      resolver,
      handler
    )
  }
}
