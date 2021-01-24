
import { MetadataInject, MetadataStorage } from '../interfaces/metadata'

let globalStorage: MetadataStorage | null = null

export class DefaultMetadataStorage implements MetadataStorage {

  static clearGlobalStorage() {
    globalStorage = null
  }

  static getGlobalStorage(): MetadataStorage {
    if (!globalStorage) {
      globalStorage = new DefaultMetadataStorage()
    }
    return globalStorage
  }

  injects = new Map<Function, MetadataInject[]>()
}
