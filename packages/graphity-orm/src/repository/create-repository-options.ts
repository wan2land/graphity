import { ConstructType, Transformer, ValueTransformer } from '@graphity/mapper'

import { ColumnType } from '../interfaces/decorator'
import { MetadataColumn } from '../interfaces/metadata'
import { RepositoryOptions } from '../interfaces/repository'
import { MetadataColumns, MetadataEntities, MetadataIds } from '../metadata'

function createTypeTransformers(type: ColumnType): ValueTransformer[] {
  switch (type) {
    case 'array':
      return [Transformer.ARRAY]
    case 'boolean':
      return [Transformer.BOOLEAN]
    case 'float':
      return [Transformer.FLOAT]
    case 'int':
      return [Transformer.INT]
    case 'string':
      return [Transformer.STRING]
  }
  return []
}

export function createRepositoryOptions<TEntity>(ctor: ConstructType<TEntity>): RepositoryOptions<TEntity> {
  const entity = MetadataEntities.get(ctor)
  if (!entity) {
    throw new Error(`this is not entity ${ctor.name}`)
  }
  const id = MetadataIds.get(ctor)
  const columns = MetadataColumns.get(ctor)
  const idColumn = columns && columns.find(column => column.property === (id && id.property))

  return {
    ctor,
    table: entity.name,
    id: idColumn && idColumn.name,
    columns: ((MetadataColumns.get(ctor) || []) as MetadataColumn<TEntity>[]).map(({ property, type, name, nullable, default: def, transformers }) => ({
      property,
      sourceKey: name,
      nullable,
      default: def,
      transformers: createTypeTransformers(type).concat(transformers),
    })),
  }
}
