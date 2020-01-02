import { Connection, Pool, QueryResult } from '../../interfaces/database'
import { Sqlite3Connection } from './connection'
import { RawSqlite3Database } from './interfaces'

export class Sqlite3SinglePool implements Pool {

  public connection: Sqlite3Connection

  public constructor(public database: RawSqlite3Database) {
    this.connection = new Sqlite3Connection(database)
  }

  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.database.close((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  public select(query: string, values: any[] = []): Promise<Record<string, any>[]> {
    return this.connection.select(query, values)
  }

  public async query(query: string, values: any[] = []): Promise<QueryResult> {
    return this.connection.query(query, values)
  }

  public getConnection(): Promise<Connection> {
    return Promise.resolve(new Sqlite3Connection(this.database))
  }
}
