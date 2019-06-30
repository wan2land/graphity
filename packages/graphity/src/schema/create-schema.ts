import { GraphQLSchema, GraphQLString, isOutputType } from "graphql"

import { ConstructType, GraphQLGuard, ResolverFactory } from "../interfaces/common"
import { MetadataMutations, MetadataQueries, MetadataResolvers } from "../metadata"
import { createResolve } from "./create-resolve"
import { ObjectTypeFactory } from "./object-type-factory"
import { ObjectTypeFactoryContainer } from "./object-type-factory-container"


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

  const types = new ObjectTypeFactoryContainer()
  const instances = new Map<any, any>()
  const queries = new ObjectTypeFactory("Query")
  const mutations = new ObjectTypeFactory("Mutation")

  for (const resolver of resolvers) {
    const metadataResolver = MetadataResolvers.get(resolver)
    if (!metadataResolver) {
      continue
    }
    const ctorOrType = metadataResolver.typeFactory ? metadataResolver.typeFactory(undefined) : GraphQLString

    for (const query of MetadataQueries.get(resolver) || []) {
      const parent = query.parent ? types.get(query.parent(undefined)) : queries
      const guards = parent === queries
        ? ([] as GraphQLGuard<any, any>[]).concat(rootGuards, queryGuards, metadataResolver.guards, query.guards)
        : ([] as GraphQLGuard<any, any>[]).concat(metadataResolver.guards, query.guards)
      parent.fields[query.name] = () => {
        const type = isOutputType(ctorOrType) ? ctorOrType : types.get(ctorOrType).factory()
        return {
          type: query.returns ? query.returns(type) : type,
          args: query.input || undefined,
          description: query.description,
          resolve: createResolve(
            guards,
            metadataResolver.target,
            query.target,
            instances,
            create
          ),
        }
      }
    }

    for (const mutation of MetadataMutations.get(resolver) || []) {
      const parent = mutation.parent ? types.get(mutation.parent(undefined)) : mutations
      const guards = parent === mutations
        ? ([] as GraphQLGuard<any, any>[]).concat(rootGuards, mutationGuards, metadataResolver.guards, mutation.guards)
        : ([] as GraphQLGuard<any, any>[]).concat(metadataResolver.guards, mutation.guards)
      parent.fields[mutation.name] = () => {
        const type = isOutputType(ctorOrType) ? ctorOrType : types.get(ctorOrType).factory()
        return {
          type: mutation.returns ? mutation.returns(type) : type,
          args: mutation.input || undefined,
          description: mutation.description,
          resolve: createResolve(
            guards,
            metadataResolver.target,
            mutation.target,
            instances,
            create
          ),
        }
      }
    }
  }

  return new GraphQLSchema({
    query: queries.factory(),
    mutation: Object.keys(mutations.fields).length ?
      mutations.factory() :
      undefined,
  })
}
