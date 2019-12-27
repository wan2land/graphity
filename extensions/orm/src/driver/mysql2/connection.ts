import { Connection as OriginConnection } from 'mysql2'

import { Connection, QueryResult, TransactionHandler } from '../../interfaces/database'

export class Mysql2Connection implements Connection {

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
      await new Promise((resolve) => {
        this.connection.rollback(() => {
          resolve()
        })
      })
      throw e
    }
  }
}
