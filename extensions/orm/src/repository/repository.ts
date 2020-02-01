import { EntityManager } from '../entity-manager/entity-manager'
import { ConstructType } from '../interfaces/common'

// import DataLoader from 'dataloader'

// export type FindCondition<TEntity> = {[name in keyof TEntity]: any}

// export interface RepositoryOptions<TEntity> extends HydratorOptions<TEntity> {
//   table: string
//   id?: {
//     property: keyof TEntity
//     sourceKey: string
//   }
// }

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

export class Repository<TEntity> {

  // public loader: DataLoader<(string | number), (TEntity | null)>
  // public queryResolver = new MysqlQueryResolver()
  public ctor!: ConstructType<TEntity>
  public em!: EntityManager

  // public constructor() {
  //   // this.loader = new DataLoader(async (ids) => {
  //   //   const nodes = await this.getMany(ids)
  //   //   return ids.map(id => nodes.find(node => node[this.options.id!.property] === id as any) || null)
  //   // })
  // }

  // public createFinder(): MysqlQueryFluent<TEntity> {
  //   return new MysqlQueryFluent<TEntity>()
  // }

  public hydrate(rows: any[]): TEntity[]
  public hydrate(row: any): TEntity
  public hydrate(rows: any): TEntity | TEntity[] {
    return this.em.getHydrator<TEntity>(this.ctor).hydrate(rows)
  }

  public get(id: (string | number)): Promise<TEntity | null> {
    return this.loader.load(id)
  }

  public async getMany(ids: (string | number)[]): Promise<TEntity[]> {
    if (ids.length === 0) {
      return []
    }
    if (ids.length === 1) {
      const node = await this.connection.first<any>(`SELECT * FROM \`${this.options.table}\` WHERE \`${this.options.id!.sourceKey}\` = ? LIMIT 1`, [ids[0]])
      return node ? [this.mapper.toEntity(node)] : []
    }
    const nodes = await this.connection.select<any>(`SELECT * FROM \`${this.options.table}\` WHERE \`${this.options.id!.sourceKey}\` IN (?${', ?'.repeat(ids.length - 1)})`, ids)
    return nodes.map(node => this.mapper.toEntity(node))
  }

  public find(condition?: FindCondition<TEntity>): Promise<TEntity | null> {
    return Promise.resolve(null)
  }

  public findMany(condition?: FindCondition<TEntity>): Promise<TEntity[]> {
    return Promise.resolve([])
  }


  // public async first(query?: QueryOptions<TEntity>): Promise<TEntity | null> {
  //   if (query) {
  //     // const qf = (typeof query === 'function' ? query(this.createFinder()) : query) as MysqlQueryFluent<TEntity>
  //     // const result = this.queryResolver.resolve(qf.createQueryStatement())
  //     // const node = await this.connection.first<any>(result.query, result.bindings)
  //     // return node ? this.mapper.toEntity(node) : null
  //   }
  //   const node = await this.connection.first<any>(`SELECT * FROM \`${this.options.table}\` LIMIT 1`)
  //   return node ? this.mapper.toEntity(node) : null
  // }

  // public retrieve(query: QueryOptions<TEntity>): Promise<TEntity[]> {
  //   return Promise.resolve([])
  // }


//   get(id: (string | number)): Promise<TEntity | null>
//   getMany(ids: (string | number)[]): Promise<TEntity[]>

//   find(condition?: FindCondition<TEntity>): Promise<TEntity | null>
//   findMany(condition?: FindCondition<TEntity>): Promise<TEntity[]>

//   // first(query?: QueryOptions<TEntity>): Promise<TEntity | null>
//   // retrieve(query?: QueryOptions<TEntity>): Promise<TEntity[]>

//   // exists(id: string): Promise<boolean>
//   // count(query?: QueryOptions<TEntity>): Promise<number>

//   // create(entityLike: DeepPartial<Entity>): Entity;

//   // persist(entity: Entity): Promise<void>

//   // create(attributes: Attrs): Promise<Entity>

//   // remove(entity: Entity): Promise<void>

//   // insert(entity: QueryPartialEntity<Entity> | (QueryPartialEntity<Entity>[]), options?: SaveOptions): Promise<InsertResult>;
//   // update(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>, partialEntity: DeepPartial<Entity>, options?: SaveOptions): Promise<UpdateResult>;
//   // delete(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>, options?: RemoveOptions): Promise<DeleteResult>;

}
