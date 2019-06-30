import { GraphQLSchema, GraphQLString, isOutputType } from "graphql"

import { ConstructType, GraphQLGuard, ResolverFactory } from "../interfaces/common"
import { MetadataMutations, MetadataQueries, MetadataResolvers } from "../metadata"
import { createResolve } from "./create-resolve"
import { ObjectTypeFactory } from "./object-type-factory"
import { ObjectTypeFactoryContainer } from "./object-type-factory-container"


const defaultCreate: ResolverFactory = (ctor) => Promise.resolve(new ctor())

export function createSchema(
  resolvers: ConstructType<any>[] = [],
  create: ResolverFactory = defaultCreate
): GraphQLSchema {

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
      const fields = query.parent ? types.get(query.parent(undefined)).fields : queries.fields
      fields[query.name] = () => {
        const type = isOutputType(ctorOrType) ? ctorOrType : types.get(ctorOrType).factory()
        return {
          type: query.returns ? query.returns(type) : type,
          args: query.input,
          description: query.description,
          resolve: createResolve(
            ([] as GraphQLGuard[]).concat(metadataResolver.guards, query.guards),
            metadataResolver.target,
            query.target,
            instances,
            create
          ),
        }
      }
    }

    for (const mutation of MetadataMutationsMap.get(resolver) || []) {
      const fields = mutation.parent ? types.get(mutation.parent(undefined)).fields : mutations.fields
      fields[mutation.name] = () => {
        const type = isOutputType(ctorOrType) ? ctorOrType : types.get(ctorOrType).factory()
        return {
          type: mutation.returns ? mutation.returns(type) : type,
          args: mutation.input,
          description: mutation.description,
          resolve: createResolve(
            ([] as GraphQLGuard[]).concat(metadataResolver.guards, mutation.guards),
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
