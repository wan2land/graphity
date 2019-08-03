import { MaybeFactory, ValueTransformer } from '@graphity/mapper'

export type ColumnType = 'any'
| 'array'
| 'string'
| 'int'
| 'float'
| 'boolean'
| 'object'

export interface ColumnDecoratorOptions {
  name?: string
  type?: ColumnType
  nullable?: boolean
  default?: MaybeFactory<any>
  transformer?: ValueTransformer | ValueTransformer[]
}

export type ColumnDecoratorFactory = (options?: ColumnDecoratorOptions) => PropertyDecorator

export interface EntityDecoratorOptions {
  name?: string
}

export type IdDecoratorFactory = () => PropertyDecorator

export type EntityDecoratorFactory = (options?: EntityDecoratorOptions) => ClassDecorator
