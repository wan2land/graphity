import { ColumnType, GeneratedStrategy, MaybeFactory, ValueTransformer } from './common'


export interface MetadataColumn<T> {
  property: keyof T
  name: string
  type: ColumnType
  nullable: boolean
  default?: MaybeFactory<any>
  transformers: ValueTransformer<any>[]
  generated?: GeneratedStrategy
}

export interface MetadataId<T> {
  property: keyof T
}

export interface MetadataEntity<T> {
  name: string
}
