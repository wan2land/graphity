import { Connection, Pool, QueryResult } from '../../interfaces/database'
import { Mysql2Connection } from './connection'
import { RawMysql2Pool } from './interfaces'

export class Mysql2Pool implements Pool {

  public constructor(public pool: RawMysql2Pool) {
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

  public select(query: string, values: any[] = []): Promise<Record<string, any>[]> {
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

  public getConnection(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          return reject(err)
        }
        resolve(new Mysql2Connection(conn))
      })
    })
  }
}
