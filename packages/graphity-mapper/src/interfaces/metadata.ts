import { ColumnType } from './decorator'
import { ValueTransformer } from './relater'
import { MaybeFactory } from './utils'


export interface MetadataColumn<T> {
  property: keyof T
  name: string
  type: ColumnType
  nullable: boolean
  default?: MaybeFactory<any>
  transformers: ValueTransformer<any>[]
}
