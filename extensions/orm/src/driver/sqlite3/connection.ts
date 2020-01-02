import { Connection, QueryResult } from '../../interfaces/database'
import { RawSqlite3Database } from './interfaces'

export class Sqlite3Connection implements Connection {

  public constructor(public connection: RawSqlite3Database) {
  }

  public select<TRow extends Record<string, any>>(query: string, values: any[] = []): Promise<TRow[]> {
    return new Promise<TRow[]>((resolve, reject) => {
      this.connection.all(query, values || [], (err, rows) => {
        if (err) {
          return reject(err)
        }
        resolve(rows)
      })
    })
  }

  public query(query: string, values: any[] = []): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      this.connection.run(query, values || [], function (err: Error|null): void {
        if (err) {
          return reject(err)
        }
        const result = this // eslint-disable-line no-invalid-this,@typescript-eslint/no-this-alias
        resolve({
          insertId: /^insert/i.test(query) ? result.lastID : undefined,
          changes: result.changes,
          raw: result,
        })
      })
    })
  }

  public release(): Promise<void> {
    return Promise.resolve()
  }

  public beginTransaction(): Promise<void> {
    return this.query('BEGIN TRANSACTION').then(() => Promise.resolve())
  }

  public commit(): Promise<void> {
    return this.query('COMMIT').then(() => Promise.resolve())
  }

  public rollback(): Promise<void> {
    return this.query('ROLLBACK').then(() => Promise.resolve())
  }
}
