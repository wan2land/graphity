import { GraphQLObjectType } from 'graphql'

import { MetadataEntity, MetadataField, MetadataResolve, MetadataResolver } from './metadata'

export interface MetadataContainer {
  metaResolvers: Map<Function, MetadataResolver>
  metaMutations: Map<Function, MetadataResolve[]>
  metaQueries: Map<Function, MetadataResolve[]>

  metaEntities: Map<Function, MetadataEntity>
  metaFields: Map<Function, MetadataField[]>

  cachedGraphQLObjects: Map<Function, GraphQLObjectType>
}
