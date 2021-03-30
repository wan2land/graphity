
import { MetadataInjectParam, MetadataInjectProp, MetadataStorable } from '../interfaces/metadata'

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

  injectParams = new Map<Function, MetadataInjectParam[]>()
  injectProps = new Map<Function, MetadataInjectProp[]>()
}
