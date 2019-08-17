import { MapperOptions } from './mapper'

export type FindCondition<TEntity> = {[name in keyof TEntity]: any}

export interface RepositoryOptions<TEntity> extends MapperOptions<TEntity> {
  table: string
  id?: {
    property: keyof TEntity
    sourceKey: string
  }
}

// export interface QueryFluent<TEntity> {
//   where(name: keyof TEntity, value: any): this
//   whereRaw(raw: QueryFragment): this
//   orWhere(name: keyof TEntity, value: any): this
//   orWhereRaw(raw: QueryFragment): this
//   // @TODO
//   // whereIn(name: keyof TEntity, values: any[]): this
//   // whereNotIn(name: keyof TEntity, values: any[]): this
//   // whereNull(name: keyof TEntity): this
//   // whereNotNull(name: keyof TEntity): this
// }

// export type QueryOptions<TEntity> = QueryFluent<TEntity> | ((query: QueryFluent<TEntity>) => QueryFluent<TEntity>) // @TODO QueryStatement

export interface Repository<TEntity> {

  // createFinder(): QueryFluent<TEntity>

  hydrate<P extends {}>(rows: P[]): TEntity[]
  hydrate<P extends {}>(rows: P): TEntity

  get(id: (string | number)): Promise<TEntity | null>
  getMany(ids: (string | number)[]): Promise<TEntity[]>

  find(condition?: FindCondition<TEntity>): Promise<TEntity | null>
  findMany(condition?: FindCondition<TEntity>): Promise<TEntity[]>

  // first(query?: QueryOptions<TEntity>): Promise<TEntity | null>
  // retrieve(query?: QueryOptions<TEntity>): Promise<TEntity[]>

  // exists(id: string): Promise<boolean>
  // count(query?: QueryOptions<TEntity>): Promise<number>

  // create(entityLike: DeepPartial<Entity>): Entity;

  // persist(entity: Entity): Promise<void>

  // create(attributes: Attrs): Promise<Entity>

  // remove(entity: Entity): Promise<void>

  // insert(entity: QueryPartialEntity<Entity> | (QueryPartialEntity<Entity>[]), options?: SaveOptions): Promise<InsertResult>;
  // update(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>, partialEntity: DeepPartial<Entity>, options?: SaveOptions): Promise<UpdateResult>;
  // delete(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>, options?: RemoveOptions): Promise<DeleteResult>;
}
