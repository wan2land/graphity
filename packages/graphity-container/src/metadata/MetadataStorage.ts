
import { MetadataInject, MetadataStorable } from '../interfaces/metadata'

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

  injects = new Map<Function, MetadataInject[]>()
}
