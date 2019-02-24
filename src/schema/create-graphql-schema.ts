import {
  GraphQLFieldConfigMap,
  GraphQLObjectType,
  GraphQLSchema,
  isOutputType
  } from "graphql"
import { ConstructType, GraphQLGuard } from "../interfaces/common"
import { metadataMutationsMap, metadataQueriesMap, metadataResolversMap } from "../metadata"
import { createGraphQLObjectType } from "./create-graphql-object-type"
import { createResolve } from "./create-resolve"


const defaultCreate: (ctor: new (...args: any[]) => any) => Promise<any> = (ctor) => Promise.resolve(new ctor())

export async function createGraphQLSchema(
  resolvers: Array<ConstructType<any>> = [],
  create: (ctor: new (...args: any[]) => any) => Promise<any> = defaultCreate): Promise<GraphQLSchema> {

  const queries: GraphQLFieldConfigMap<any, any> = {}
  const mutations: GraphQLFieldConfigMap<any, any> = {}

  for (const resolver of resolvers) {
    const metadataResolver = metadataResolversMap.get(resolver)
    if (!metadataResolver) {
      continue
    }
    const typeOrCtor = metadataResolver.typeFactory(undefined)
    const type = isOutputType(typeOrCtor) ? typeOrCtor : createGraphQLObjectType(typeOrCtor)

    const instance = await create(metadataResolver.target)
    for (const query of metadataQueriesMap.get(resolver) || []) {
      queries[query.name] = {
        type: query.returns ? query.returns(type) : type,
        args: query.input,
        resolve: createResolve(
          ([] as GraphQLGuard[]).concat(metadataResolver.guards, query.guards),
          instance,
          query.property
        ),
      }
    }

    for (const mutation of metadataMutationsMap.get(resolver) || []) {
      mutations[mutation.name] = {
        type: mutation.returns ? mutation.returns(type) : type,
        args: mutation.input,
        resolve: createResolve(
          ([] as GraphQLGuard[]).concat(metadataResolver.guards, mutation.guards),
          instance,
          mutation.property
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
