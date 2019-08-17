import { MetadataColumn } from '../interfaces/metadata'
import { RepositoryOptions } from '../interfaces/repository'
import { ConstructType } from '../interfaces/utils'
import { MetadataColumns, MetadataEntities, MetadataIds } from '../metadata'


export function createRepositoryOptions<TEntity>(ctor: ConstructType<TEntity>): RepositoryOptions<TEntity> {
  const entity = MetadataEntities.get(ctor)
  if (!entity) {
    throw new Error(`this is not entity ${ctor.name}`)
  }
  const id = MetadataIds.get(ctor)
  const columns = (MetadataColumns.get(ctor) || []) as MetadataColumn<TEntity>[]
  const idColumn = columns && columns.find(column => column.property === (id && id.property))
  return {
    ctor,
    table: entity.name,
    id: idColumn && {
      property: idColumn.property,
      sourceKey: idColumn.name,
    },
    columns: columns.map(({ property, type, name, nullable, default: def, transformers }) => ({
      property,
      type,
      sourceKey: name,
      nullable,
      default: def,
      transformers,
    })),
  }
}
