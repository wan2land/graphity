import { ValueTransformer, ColumnType } from './mapper'
import { MaybeFactory } from './utils'


export interface EntityDecoratorOptions {
  name?: string
}

export interface ColumnDecoratorOptions {
  name?: string
  type?: ColumnType
  nullable?: boolean
  default?: MaybeFactory<any>
  transformer?: ValueTransformer | ValueTransformer[]
}

export type EntityDecoratorFactory = (options?: EntityDecoratorOptions) => ClassDecorator

export type ColumnDecoratorFactory = (options?: ColumnDecoratorOptions) => PropertyDecorator

export type IdDecoratorFactory = () => PropertyDecorator
