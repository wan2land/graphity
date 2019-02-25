import { MaybeArray, ResolverFactory } from "../interfaces/common"
import { metadataResolversMap } from "../metadata"
import { createGraphQLSchema } from "../schema/create-graphql-schema"
import { loadFiles } from "../utils/load-files"


export interface GraphityOptions {
  resolvers: MaybeArray<string>
  resolverFactory?: ResolverFactory
}

export async function create(options: GraphityOptions) {
  await loadFiles(options.resolvers)
  return await createGraphQLSchema(
    [...metadataResolversMap.keys()],
    options.resolverFactory
  )
}
