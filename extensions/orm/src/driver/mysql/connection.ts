import { Connection, QueryResult } from '../../interfaces/database'
import { RawMysqlPoolConnection } from './interfaces'


export class MysqlConnection implements Connection {

  public constructor(public connection: RawMysqlPoolConnection) {
  }

  public release(): Promise<void> {
    this.connection.release()
    return Promise.resolve()
  }

  public select(query: string, values: any[] = []): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve(rows?.map?.((result: any) => ({ ...result })) || [])
      })
    })
  }

  public query(query: string, values: any[] = []): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (err, result) => {
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
