import { Connection as OriginConnection, QueryResult, Row, TransactionHandler } from '@stdjs/database'

import { MysqlRepository } from '../dialects/mysql/repository'
import { Repository } from '../interfaces/repository'
import { ConstructType } from '../interfaces/utils'
import { Mapper } from '../mapper/mapper'
import { createRepositoryOptions } from '../repository/create-repository-options'


export interface ConnectionOptions {
  dialect: string
}

export class Connection implements OriginConnection {

  public repositories: Map<ConstructType<any>, Repository<any>>

  public constructor(public connection: OriginConnection, public options: ConnectionOptions) {
    this.repositories = new Map()
  }

  public close(): Promise<void> {
    return this.connection.close()
  }

  public query(query: string, values?: any[]): Promise<QueryResult> {
    return this.connection.query(query, values)
  }

  public first<TRow>(query: string, values?: any[]): Promise<TRow> {
    return this.connection.first(query, values)
  }

  public select<TRow extends Row>(query: string, values?: any[]): Promise<TRow[]> {
    return this.connection.select(query, values)
  }

  public transaction<TResult>(handler: TransactionHandler<TResult>): Promise<TResult> {
    return this.connection.transaction(handler)
  }

  public getRepository<TEntity>(entity: ConstructType<TEntity>): Repository<TEntity> {
    const repository = this.repositories.get(entity)
    if (repository) {
      return repository
    }
    const options = createRepositoryOptions(entity)
    const mapper = new Mapper<TEntity>(options)
    if (this.options.dialect === 'mysql') {
      return new MysqlRepository<TEntity>(this, mapper, options)
    }
    throw new Error(`unknown dialect(${this.options.dialect})`)
  }
}
