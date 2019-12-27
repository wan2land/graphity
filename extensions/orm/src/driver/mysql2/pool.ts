import { Pool as OriginPool } from 'mysql2'

import { Pool, PoolConnection, QueryResult, TransactionHandler } from '../../interfaces/database'
import { Mysql2PoolConnection } from './pool-connection'


export class Mysql2Pool implements Pool {

  public constructor(public pool: OriginPool) {
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  public select<TRow extends Record<string, any>>(query: string, values: any[] = []): Promise<TRow[]> {
    if (Array.isArray(values)) {
      values = values.map(value => typeof value === 'undefined' ? null : value)
    }
    return new Promise((resolve, reject) => {
      this.pool.execute(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve(rows && rows.map ? rows.map((result: any) => ({ ...result })) : [])
      })
    })
  }

  public query(query: string, values: any[] = []): Promise<QueryResult> {
    if (Array.isArray(values)) {
      values = values.map(value => typeof value === 'undefined' ? null : value)
    }
    return new Promise((resolve, reject) => {
      this.pool.execute(query, values, (err, result) => {
        if (err) {
          return reject(err)
        }

        resolve({
          insertId: (Array.isArray(result) ? undefined : result.insertId) || undefined,
          changes: Array.isArray(result) ? 0 : result.affectedRows,
          raw: result,
        })
      })
    })
  }

  public async transaction<TResult>(handler: TransactionHandler<TResult>): Promise<TResult> {
    const connection = await this.getConnection()
    try {
      const result = connection.transaction(handler)
      await connection.release()
      return result
    } catch (e) {
      await connection.release()
      throw e
    }
  }

  public getConnection(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          return reject(err)
        }
        resolve(new Mysql2PoolConnection(conn))
      })
    })
  }
}
