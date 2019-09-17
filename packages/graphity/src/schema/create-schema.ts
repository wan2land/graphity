import { GraphQLObjectType, GraphQLSchema } from 'graphql'

import { ConstructType, CreateResolveHandler, GraphQLGuard, ResolverFactory } from '../interfaces/common'
import { createMutationObject } from './create-mutation-object'
import { createQueryObject } from './create-query-object'
import { executeResolver } from './execute-resolver'

const defaultCreate: ResolverFactory = (ctor) => Promise.resolve(new ctor())

const createResolve: (resolvers: Map<any, any>, create: ResolverFactory) => CreateResolveHandler = (resolvers, create) => (ctor, handler, guards) => async (parent, args, ctx, info) => {
  let instance = resolvers.get(ctor)
  if (!instance) {
    instance = await create(ctor as any)
    resolvers.set(ctor, instance)
  }
  return executeResolver(
    guards,
    handler.bind(instance),
    parent,
    args,
    ctx,
    info
  )
}

export interface CreateSchemaOptions {
  resolvers: ConstructType<any>[]
  rootGuards: GraphQLGuard<any, any>[]
  queryGuards: GraphQLGuard<any, any>[]
  mutationGuards: GraphQLGuard<any, any>[]
  create: ResolverFactory
}

export function createSchema({
  resolvers = [],
  rootGuards = [],
  queryGuards = [],
  mutationGuards = [],
  create = defaultCreate,
}: Partial<CreateSchemaOptions>): GraphQLSchema {

  const types = new Map<ConstructType<any>, GraphQLObjectType>()
  const instances = new Map<ConstructType<any>, any>()

  const queryObject = createQueryObject({
    // name: string
    container: types,
    resolvers,
    rootGuards,
    queryGuards,
    create: createResolve(instances, create),
  })
  const mutationObject = createMutationObject({
    // name: string
    container: types,
    resolvers,
    rootGuards,
    mutationGuards,
    create: createResolve(instances, create),
  })
  return new GraphQLSchema({
    query: queryObject,
    mutation: Object.keys(mutationObject.getFields()).length > 0 ? mutationObject : undefined,
  })
}
