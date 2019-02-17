import {
  GraphQLFieldConfigMap,
  GraphQLObjectType,
  GraphQLSchema,
  isOutputType
  } from "graphql"
import { ConstructType, GraphQLGuard } from "../interfaces/common"
import { metadataResolvers, metadataResolvesMap } from "../metadata"
import { createGraphQLTypeFromEntity } from "./create-graphql-type-from-entity"
import { createResolve } from "./create-resolve"


const defaultCreate: (ctor: new (...args: any[]) => any) => Promise<any> = (ctor) => Promise.resolve(new ctor())

export async function createGraphQLSchemaFromResolvers(
  resolvers: Array<ConstructType<any>> = [],
  create: (ctor: new (...args: any[]) => any) => Promise<any> = defaultCreate): Promise<GraphQLSchema> {

  const queries: GraphQLFieldConfigMap<any, any> = {}
  const mutations: GraphQLFieldConfigMap<any, any> = {}

  for (const resolver of resolvers) {
    const metadataResolver = metadataResolvers.get(resolver)
    if (!metadataResolver) {
      continue
    }
    const typeOrCtor = metadataResolver.typeFactory(undefined)
    const type = isOutputType(typeOrCtor) ? typeOrCtor : createGraphQLTypeFromEntity(typeOrCtor)

    const instance = await create(metadataResolver.target)
    for (const resolve of metadataResolvesMap.get(resolver) || []) {
      queries[resolve.name] = {
        type: resolve.returns ? resolve.returns(type) : type,
        resolve: createResolve(
          ([] as GraphQLGuard[]).concat(metadataResolver.guards, resolve.guards),
          instance,
          resolve.property
        ),
      }
    }
  }

  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      fields: queries,
    }),
    mutation: Object.keys(mutations).length
      ? new GraphQLObjectType({
        name: "Mutation",
        fields: mutations,
      })
      : undefined,
  })
}
