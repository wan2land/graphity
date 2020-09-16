import { MetadataStorage } from '../metadata/storage'

export interface GraphityEntityParams {
  name?: string
  description?: string
  metadataStorage?: MetadataStorage
}

export function GraphityEntity(params: GraphityEntityParams = {}): ClassDecorator {
  const metadataEntities = (params.metadataStorage ?? MetadataStorage.getGlobalStorage()).entities

  return (target) => {
    metadataEntities.set(target, {
      target,
      name: params.name ?? target.name,
      description: params.description ?? null,
    })
  }
}
