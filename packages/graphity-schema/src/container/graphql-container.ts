import { SharedContainer } from '@graphity/container'
import { GraphQLObjectType } from 'graphql'

import { MetadataContainer } from '../interfaces/container'
import { MetadataEntity, MetadataField, MetadataResolver, MetadataResolve } from '../interfaces/metadata'


let container: GraphQLContainer | null = null

export class GraphQLContainer extends SharedContainer implements MetadataContainer {

  static clearGlobalContainer() {
    container = null
  }

  static getGlobalContainer(): GraphQLContainer {
    if (!container) {
      container = new GraphQLContainer()
    }
    return container
  }


  metaResolvers = new Map<Function, MetadataResolver>()
  metaMutations = new Map<Function, MetadataResolve[]>()
  metaQueries = new Map<Function, MetadataResolve[]>()

  metaEntities = new Map<Function, MetadataEntity>()
  metaFields = new Map<Function, MetadataField[]>()

  cachedGraphQLObjects = new Map<Function, GraphQLObjectType>()
}
