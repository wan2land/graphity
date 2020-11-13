import { GraphQLObjectType } from 'graphql'

import { MetadataEntity, MetadataField, MetadataResolver, MetadataResolve } from '../interfaces/metadata'

let storage: MetadataStorage | null = null

export class MetadataStorage {

  static clearGlobalStorage() {
    storage = null
  }

  static getGlobalStorage(): MetadataStorage {
    if (!storage) {
      storage = new MetadataStorage()
    }
    return storage
  }

  entities = new Map<Function, MetadataEntity>()
  entityFields = new Map<Function, MetadataField[]>()

  resolvers = new Map<Function, MetadataResolver>()
  resolverMutations = new Map<Function, MetadataResolve[]>()
  resolverQueries = new Map<Function, MetadataResolve[]>()

  cachedObjects = new Map<Function, GraphQLObjectType>()
}
