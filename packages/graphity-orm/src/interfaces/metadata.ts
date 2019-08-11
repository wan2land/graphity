import { ColumnType } from './decorator'
import { ValueTransformer } from './mapper'
import { MaybeFactory } from './utils'


export interface MetadataColumn<T> {
  property: keyof T
  name: string
  type: ColumnType
  nullable: boolean
  default?: MaybeFactory<any>
  transformers: ValueTransformer<any>[]
}

export interface MetadataId<T> {
  property: keyof T
}

export interface MetadataEntity<T> {
  name: string
}
