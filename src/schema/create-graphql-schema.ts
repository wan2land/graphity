import { GraphQLSchema, isOutputType } from "graphql"
import { ConstructType, GraphQLGuard, ResolverFactory } from "../interfaces/common"
import { metadataMutationsMap, metadataQueriesMap, metadataResolversMap } from "../metadata"
import { createResolve } from "./create-resolve"
import { GraphQLObjectTypeFactory } from "./graphql-object-type-factory"
import { ObjectTypeFactoryContainer } from "./object-type-factory-container"


const defaultCreate: ResolverFactory = (ctor) => Promise.resolve(new ctor())

export async function createGraphQLSchema(
  resolvers: Array<ConstructType<any>> = [],
  create: ResolverFactory = defaultCreate
): Promise<GraphQLSchema> {

  const types = new ObjectTypeFactoryContainer()
  const instances = new Map<any, any>()
  const queries = new GraphQLObjectTypeFactory("Query")
  const mutations = new GraphQLObjectTypeFactory("Mutation")

  for (const resolver of resolvers) {
    const metadataResolver = metadataResolversMap.get(resolver)
    if (!metadataResolver) {
      continue
    }
    const ctorOrType = metadataResolver.typeFactory(undefined)

    const instance = await create(metadataResolver.target)
    for (const query of metadataQueriesMap.get(resolver) || []) {
      const fields = query.parent ? types.get(query.parent(undefined)).fields : queries.fields
      const resolve = createResolve(
        ([] as GraphQLGuard[]).concat(metadataResolver.guards, query.guards),
        instance,
        query.property
      )
      fields[query.name] = () => {
        const type = isOutputType(ctorOrType) ? ctorOrType : types.get(ctorOrType).factory()
        return {
          type: query.returns ? query.returns(type) : type,
          args: query.input,
          description: query.description,
          resolve,
        }
      }
    }

    for (const mutation of metadataMutationsMap.get(resolver) || []) {
      const fields = mutation.parent ? types.get(mutation.parent(undefined)).fields : mutations.fields
      const resolve = createResolve(
        ([] as GraphQLGuard[]).concat(metadataResolver.guards, mutation.guards),
        instance,
        mutation.property
      )
      fields[mutation.name] = () => {
        const type = isOutputType(ctorOrType) ? ctorOrType : types.get(ctorOrType).factory()
        return {
          type: mutation.returns ? mutation.returns(type) : type,
          args: mutation.input,
          description: mutation.description,
          resolve,
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
