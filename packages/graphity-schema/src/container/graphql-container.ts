import { SharedContainer } from '@graphity/container'
import { GraphQLObjectType } from 'graphql'

import { MetadataContainer } from '../interfaces/container'
import { MetadataEntity, MetadataField, MetadataResolver, MetadataResolve, MetadataSubscriptionResolve } from '../interfaces/metadata'


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
  metaQueries = new Map<Function, MetadataResolve[]>()
  metaMutations = new Map<Function, MetadataResolve[]>()
  metaSubscriptions = new Map<Function, MetadataSubscriptionResolve[]>()

  metaEntities = new Map<Function, MetadataEntity>()
  metaFields = new Map<Function, MetadataField[]>()

  cachedGraphQLObjects = new Map<Function, GraphQLObjectType>()
}
