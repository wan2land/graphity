import { MetadataEntity, MetadataField, MetadataResolve, MetadataResolver } from './interfaces/metadata'
import { ConstructType } from './interfaces/common'

export const MetadataResolvers = new Map<ConstructType<any>, MetadataResolver>()
export const MetadataQueries = new Map<ConstructType<any>, MetadataResolve[]>()
export const MetadataMutations = new Map<ConstructType<any>, MetadataResolve[]>()

export const MetadataEntities = new Map<ConstructType<any>, MetadataEntity>()
export const MetadataFields = new Map<ConstructType<any>, MetadataField[]>()
