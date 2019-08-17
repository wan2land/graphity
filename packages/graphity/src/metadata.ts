import { MetadataEntity, MetadataField, MetadataResolve, MetadataResolver } from './interfaces/metadata'

export const MetadataResolvers = new Map<any, MetadataResolver>()
export const MetadataQueries = new Map<any, MetadataResolve[]>()
export const MetadataMutations = new Map<any, MetadataResolve[]>()

export const MetadataEntities = new Map<any, MetadataEntity>()
export const MetadataFields = new Map<any, MetadataField[]>()
