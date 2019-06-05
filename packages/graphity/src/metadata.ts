import { MetadataEntity, MetadataField, MetadataResolve, MetadataResolver } from "./interfaces/metadata"

export const metadataResolversMap = new Map<any, MetadataResolver>()
export const metadataQueriesMap = new Map<any, MetadataResolve[]>()
export const metadataMutationsMap = new Map<any, MetadataResolve[]>()

export const metadataEntitiesMap = new Map<any, MetadataEntity>()
export const metadataFieldsMap = new Map<any, MetadataField[]>()
