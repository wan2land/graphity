import { MetadataEntity, MetadataId, MetadataColumn } from './interfaces/metadata'

export const MetadataIds = new Map<any, MetadataId<any>>()

export const MetadataEntities = new Map<any, MetadataEntity<any>>()

export const MetadataColumns = new Map<any, MetadataColumn<any>[]>()
