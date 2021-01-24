import { MetadataStorable } from '../interfaces/metadata'
import { MetadataStorage } from '../metadata/MetadataStorage'


export interface GraphityEntityParams {
  name?: string
  description?: string
  storage?: MetadataStorable
}

export function GraphityEntity(params: GraphityEntityParams = {}): ClassDecorator {
  const storage = params.storage ?? MetadataStorage.getGlobalStorage()
  const metaEntities = storage.entities

  return (target) => {
    metaEntities.set(target, {
      target,
      name: params.name ?? target.name,
      description: params.description ?? null,
    })
  }
}
