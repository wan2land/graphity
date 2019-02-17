import {
  MetadataEntity,
  MetadataField,
  MetadataResolve,
  MetadataResolver
  } from "./interfaces/metadata"

export const metadataResolvers = new Map<any, MetadataResolver>()
export const metadataResolvesMap = new Map<any, MetadataResolve[]>()

export const metadataEntities = new Map<any, MetadataEntity>()
export const metadataFieldsMap = new Map<any, MetadataField[]>()
