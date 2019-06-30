import { MetadataEntity, MetadataField, MetadataResolve, MetadataResolver } from "./interfaces/metadata"

export const MetadataResolversMap = new Map<any, MetadataResolver>()
export const MetadataQueriesMap = new Map<any, MetadataResolve[]>()
export const MetadataMutationsMap = new Map<any, MetadataResolve[]>()

export const MetadataEntitiesMap = new Map<any, MetadataEntity>()
export const MetadataFieldsMap = new Map<any, MetadataField[]>()
