import { Connection, QueryResult } from '../../interfaces/database'
import { RawMysql2PoolConnection } from './interfaces'


export class Mysql2Connection implements Connection {

  public constructor(public connection: RawMysql2PoolConnection) {
  }

  public release(): Promise<void> {
    this.connection.release()
    return Promise.resolve()
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.end((err: any) => {
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
      this.connection.execute(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve(rows?.map ? rows.map((result: any) => ({ ...result })) : [])
      })
    })
  }

  public query(query: string, values: any[] = []): Promise<QueryResult> {
    if (Array.isArray(values)) {
      values = values.map(value => typeof value === 'undefined' ? null : value)
    }
    return new Promise((resolve, reject) => {
      this.connection.execute(query, values, (err, result) => {
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

  public beginTransaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.beginTransaction((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  public commit(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.commit((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  public rollback(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.rollback((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }
}
