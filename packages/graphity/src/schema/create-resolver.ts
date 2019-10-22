import { Container } from '@graphity/container'
import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'

import { Callable, ConstructType } from '../interfaces/common'
import { Middleware } from '../interfaces/graphity'

function executeResolver<TSource, TContext, TArgs = { [argName: string]: any }>(
  originParent: TSource,
  originArgs: TArgs,
  originContext: TContext,
  originInfo: GraphQLResolveInfo,
  container: Container,
  middlewares: ConstructType<Middleware<any, any>>[],
  resolver: ConstructType<any> | null,
  handler: Callable
): Promise<any> {
  if (middlewares.length > 0) {
    const firstMiddleware = container.instances.get(middlewares[0]) as Middleware
    const nextMiddlewares = middlewares.slice(1)
    return firstMiddleware.handle({
      parent: originParent,
      args: originArgs,
      context: originContext,
      info: originInfo,
    }, ({ parent, args, context, info } = {}) => {
      return executeResolver(
        typeof parent === 'undefined' ? originParent : parent,
        typeof args === 'undefined' ? originArgs : args,
        typeof context === 'undefined' ? originContext : context,
        typeof info === 'undefined' ? originInfo : info,
        container,
        nextMiddlewares,
        resolver,
        handler
      )
    })
  }
  const resolveInstance = resolver && container.instances.get(resolver) || null
  return resolveInstance
    ? handler.call(resolveInstance, originParent, originArgs, originContext, originInfo)
    : handler(originParent, originArgs, originContext, originInfo)
}

export function createResolver<TSource, TContext, TArgs = Record<string, any>>(
  container: Container,
  middlewares: ConstructType<Middleware<any, any>>[],
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
