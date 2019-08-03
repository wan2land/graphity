import { Mapper, MaybeArray } from '@graphity/mapper'
import DataLoader from 'dataloader'

import { Connection } from '../../connection/connection'
import { Repository, RepositoryOptions } from '../../interfaces/repository'

export class MysqlRepository<TEntity> implements Repository<TEntity> {

  public loader: DataLoader<(string | number), (TEntity | null)>

  public constructor(
    public connection: Connection,
    public mapper: Mapper<TEntity>,
    public options: RepositoryOptions<TEntity>,
  ) {
    this.loader = new DataLoader(async (ids) => {
      const nodes = await this.findByIds(ids)
      return ids.map(id => nodes.find(node => node[this.options.id!.property] === id as any) || null)
    })
  }

  public hydrate<P extends {}>(rows: P[]): TEntity[]
  public hydrate<P extends {}>(rows: P): TEntity
  public hydrate<P extends {}>(rows: MaybeArray<P>): MaybeArray<TEntity> {
    return this.mapper.toEntity(rows)
  }

  public findById(id: (string | number)): Promise<TEntity | null> {
    return this.loader.load(id)
  }

  public async findByIds(ids: (string | number)[]): Promise<TEntity[]> {
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

  // public async first(options: HasWhereStmt = {}): Promise<Entity|undefined> {
  //   const node = await this.connection.first(
  //     this.queryBuilderFactory.create({
  //       type: "select",
  //       table: this.options.table,
  //       columns: ["*"],
  //       ...options,
  //       take: 1,
  //     })
  //   )
  //   return node ? this.hydrate(node) : undefined
  // }

  // public async retrieve(options: HasWhereStmt = {}): Promise<Entity[]> {
  //   const nodes = await this.connection.select(
  //     this.queryBuilderFactory.create({
  //       type: "select",
  //       table: this.options.table,
  //       columns: ["*"],
  //       ...options,
  //     })
  //   )
  //   return this.hydrate(nodes)
  // }
}
