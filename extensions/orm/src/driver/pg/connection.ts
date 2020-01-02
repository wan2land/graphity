import { Connection, QueryResult } from '../../interfaces/database'
import { RawPgPoolConnection } from './interfaces'


export class PgConnection implements Connection {

  public constructor(public client: RawPgPoolConnection) {
  }

  public close(): Promise<void> {
    if ((this.client as any)._connected) {
      return Promise.resolve(this.client.release())
    }
    return Promise.resolve()
  }

  public async select(query: string, values: any[] = []): Promise<Record<string, any>[]> {
    await this.connect()
    const result = await this.client.query(query, values || [])
    return result.rows
  }

  public async query(query: string, values: any[] = []): Promise<QueryResult> {
    await this.connect()
    const result = await this.client.query(query, values || [])
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

  public async connect(): Promise<void> {
    if (!(this.client as any)._connected) {
      await this.client.connect()
    }
  }

  public beginTransaction(): Promise<void> {
    return this.query('BEGIN').then(() => Promise.resolve())
  }

  public commit(): Promise<void> {
    return this.query('COMMIT').then(() => Promise.resolve())
  }

  public rollback(): Promise<void> {
    return this.query('ROLLBACK').then(() => Promise.resolve())
  }

  public release(): Promise<void> {
    return Promise.resolve(this.client.release())
  }
}
