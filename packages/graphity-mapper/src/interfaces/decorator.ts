import { ValueTransformer } from './relater'
import { MaybeFactory } from './utils'

export enum ColumnType {
  Any = 'any',
  Array = 'array',
  String = 'string',
  Int = 'int',
  Float = 'float',
  Boolean = 'boolean',
  Object = 'object',
}

export interface ColumnDecoratorOptions {
  name?: string
  type?: ColumnType
  nullable?: boolean
  default?: MaybeFactory<any>
  transformer?: ValueTransformer | ValueTransformer[]
}

export type ColumnDecoratorFactory = (options?: ColumnDecoratorOptions) => PropertyDecorator
