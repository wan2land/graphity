import { GraphQLObjectType, GraphQLSchema } from 'graphql'

import { ConstructType, CreateResolveHandler, GraphQLGuard, ResolverFactory } from '../interfaces/common'
import { createMutationObject } from './create-mutation-object'
import { createQueryObject } from './create-query-object'

const defaultCreate: ResolverFactory = (ctor) => Promise.resolve(new ctor())

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

  const createResolver: CreateResolveHandler = (ctor, handler) => {
    return async (parent, args, ctx, info) => {
      let instance = instances.get(ctor)
      if (!instance) {
        instance = await create(ctor as any)
        instances.set(ctor, instance)
      }
      return handler.call(instance, parent, args, ctx, info)
    }
  }

  const queryObject = createQueryObject({
    // name: string
    container: types,
    resolvers,
    rootGuards,
    queryGuards,
    create: createResolver,
  })
  const mutationObject = createMutationObject({
    // name: string
    container: types,
    resolvers,
    rootGuards,
    mutationGuards,
    create: createResolver,
  })
  return new GraphQLSchema({
    query: queryObject,
    mutation: Object.keys(mutationObject.getFields()).length > 0 ? mutationObject : undefined,
  })
}
