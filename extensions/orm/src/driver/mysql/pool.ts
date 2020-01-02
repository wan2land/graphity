import { Connection, Pool, QueryResult } from '../../interfaces/database'
import { MysqlConnection } from './connection'
import { RawMysqlPool } from './interfaces'


export class MysqlPool implements Pool {

  public constructor(public pool: RawMysqlPool) {
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
    return new Promise((resolve, reject) => {
      this.pool.query(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve(rows?.map?.((result: any) => ({ ...result })) || [])
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

  public getConnection(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          return reject(err)
        }
        resolve(new MysqlConnection(conn))
      })
    })
  }
}
