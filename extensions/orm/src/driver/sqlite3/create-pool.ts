import { Sqlite3SinglePool } from './single-pool'


export function createSqlite3Pool(filename: string, mode?: number): Sqlite3SinglePool {
  const Database = require('sqlite3').Database // eslint-disable-line @typescript-eslint/no-require-imports
  return new Sqlite3SinglePool(new Database(filename, mode))
}
