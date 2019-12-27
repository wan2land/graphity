import { Pool as OriginPool } from 'pg'

import { Pool, PoolConnection, QueryResult, TransactionHandler } from '../../interfaces/database'
import { PgPoolConnection } from './pool-connection'


export class PgPool implements Pool {

  public constructor(public pool: OriginPool) {
  }

  public async close(): Promise<void> {
    await this.pool.end()
  }


  public async select<TRow extends Record<string, any>>(query: string, values: any[] = []): Promise<TRow[]> {
    return (await this.pool.query(query, values || [])).rows
  }

  public async query(query: string, values: any[] = []): Promise<QueryResult> {
    const result = await this.pool.query(query, values || [])
    let insertId: any
    if (result.rows.length > 0) {
      const firstRow = result.rows[0]
      const keys = Object.keys(firstRow)
      insertId = firstRow[keys[0]]
    }
    return {
      insertId,
      changes: result.rowCount,
      raw: result,
    }
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

  public async getConnection(): Promise<PoolConnection> {
    return new PgPoolConnection(await this.pool.connect())
  }
}
