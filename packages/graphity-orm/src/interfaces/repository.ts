import { MapperOptions } from '@graphity/mapper'

export interface RepositoryOptions<TEntity> extends MapperOptions<TEntity> {
  table: string
  id?: {
    property: keyof TEntity
    sourceKey: string
  }
}

export interface Repository<TEntity> {

  hydrate<P extends {}>(rows: P[]): TEntity[]
  hydrate<P extends {}>(rows: P): TEntity

  findById(id: (string | number | symbol)): Promise<TEntity | null>
  findByIds(ids: (string | number | symbol)[]): Promise<TEntity[]>

  // find
  // retrieve(options: HasWhereStmt = {}): Promise<Entity[]>

  // exists(id: string): Promise<boolean>
  // count(options?: FindManyOptions<Entity>): Promise<number>

  // create(entityLike: DeepPartial<Entity>): Entity;

  // persist(entity: Entity): Promise<void>

  // create(attributes: Attrs): Promise<Entity>

  // remove(entity: Entity): Promise<void>

  // insert(entity: QueryPartialEntity<Entity> | (QueryPartialEntity<Entity>[]), options?: SaveOptions): Promise<InsertResult>;
  // update(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>, partialEntity: DeepPartial<Entity>, options?: SaveOptions): Promise<UpdateResult>;
  // delete(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>, options?: RemoveOptions): Promise<DeleteResult>;
}
