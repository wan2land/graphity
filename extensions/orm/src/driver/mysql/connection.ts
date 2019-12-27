import { Connection as OriginConnection } from 'mysql'

import { Connection, QueryResult, TransactionHandler } from '../../interfaces/database'


export class MysqlConnection implements Connection {

  public constructor(public connection: OriginConnection) {
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
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (err, rows: any) => {
        if (err) {
          return reject(err)
        }
        resolve(rows && rows.map ? rows.map((result: any) => ({ ...result })) : [])
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

  public async transaction<TResult>(handler: TransactionHandler<TResult>): Promise<TResult> {
    await new Promise((resolve, reject) => {
      this.connection.beginTransaction((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
    try {
      const ret = await handler(this)
      await new Promise((resolve, reject) => {
        this.connection.commit((err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })
      return ret
    } catch (e) {
      await new Promise((resolve, reject) => {
        this.connection.rollback((err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })
      throw e
    }
  }
}
