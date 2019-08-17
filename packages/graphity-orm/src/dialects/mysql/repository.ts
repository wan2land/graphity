import DataLoader from 'dataloader'

import { Connection } from '../../connection/connection'
import { FindCondition, Repository, RepositoryOptions } from '../../interfaces/repository'
import { MaybeArray } from '../../interfaces/utils'
import { Mapper } from '../../mapper/mapper'
import { MysqlQueryResolver } from './query-resolver'


export class MysqlRepository<TEntity> implements Repository<TEntity> {

  public loader: DataLoader<(string | number), (TEntity | null)>
  public queryResolver = new MysqlQueryResolver()

  public constructor(
    public connection: Connection,
    public mapper: Mapper<TEntity>,
    public options: RepositoryOptions<TEntity>,
  ) {
    this.loader = new DataLoader(async (ids) => {
      const nodes = await this.getMany(ids)
      return ids.map(id => nodes.find(node => node[this.options.id!.property] === id as any) || null)
    })
  }

  // public createFinder(): MysqlQueryFluent<TEntity> {
  //   return new MysqlQueryFluent<TEntity>()
  // }

  public hydrate<P extends {}>(rows: P[]): TEntity[]
  public hydrate<P extends {}>(rows: P): TEntity
  public hydrate<P extends {}>(rows: MaybeArray<P>): MaybeArray<TEntity> {
    return this.mapper.toEntity(rows)
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
}
