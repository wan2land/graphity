import { Connection, Pool, QueryResult } from '../../interfaces/database'
import { PgConnection } from './connection'
import { RawPgPool } from './interfaces'

export class PgPool implements Pool {

  public constructor(public pool: RawPgPool) {
  }

  public async close(): Promise<void> {
    await this.pool.end()
  }


  public async select(query: string, values: any[] = []): Promise<Record<string, any>[]> {
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

  public async getConnection(): Promise<Connection> {
    return new PgConnection(await this.pool.connect())
  }
}
