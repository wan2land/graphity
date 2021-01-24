import { GraphQLObjectType } from 'graphql'

import { MetadataEntity, MetadataField, MetadataResolve, MetadataResolver, MetadataStorable, MetadataSubscriptionResolve } from '../interfaces/metadata'

let globalStorage: MetadataStorable | null = null

export class MetadataStorage implements MetadataStorable {

  static clearGlobalStorage() {
    globalStorage = null
  }

  static getGlobalStorage(): MetadataStorable {
    if (!globalStorage) {
      globalStorage = new MetadataStorage()
    }
    return globalStorage
  }

  resolvers = new Map<Function, MetadataResolver>()
  queries = new Map<Function, MetadataResolve[]>()
  mutations = new Map<Function, MetadataResolve[]>()
  subscriptions = new Map<Function, MetadataSubscriptionResolve[]>()

  entities = new Map<Function, MetadataEntity>()
  fields = new Map<Function, MetadataField[]>()

  cachedGraphQLObjects = new Map<Function, GraphQLObjectType>()
}
