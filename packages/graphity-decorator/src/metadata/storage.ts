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

  public entities = new Map<Function, MetadataEntity>()
  public entityFields = new Map<Function, MetadataField[]>()

  public resolvers = new Map<Function, MetadataResolver>()
  public resolverMutations = new Map<Function, MetadataResolve[]>()
  public resolverQueries = new Map<Function, MetadataResolve[]>()
}
