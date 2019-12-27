import { Pool as OriginPool } from 'mysql'

import { Pool, PoolConnection, QueryResult, TransactionHandler } from '../../interfaces/database'
import { MysqlPoolConnection } from './pool-connection'


export class MysqlPool implements Pool {

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
    return new Promise((resolve, reject) => {
      this.pool.query(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve(rows?.map ? rows.map((result: any) => ({ ...result })) : [])
      })
    })
  }

  public query(query: string, values: any[] = []): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      this.pool.query(query, values, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve({
          insertId: result.insertId || undefined,
          changes: result.affectedRows,
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
        resolve(new MysqlPoolConnection(conn))
      })
    })
  }
}
