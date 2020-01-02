

/*
 * ref. https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/sqlite3/index.d.ts
 */

export interface RawSqlite3Result extends RawSqlite3Statement {
  lastID: number
  changes: number
}

export interface RawSqlite3Statement {
  bind(callback?: (err: Error | null) => void): this
  bind(...params: any[]): this

  reset(callback?: (err: null) => void): this

  finalize(callback?: (err: Error) => void): RawSqlite3Database

  run(callback?: (err: Error | null) => void): this
  run(params: any, callback?: (this: RawSqlite3Result, err: Error | null) => void): this
  run(...params: any[]): this

  get(callback?: (err: Error | null, row?: any) => void): this
  get(params: any, callback?: (this: RawSqlite3Result, err: Error | null, row?: any) => void): this
  get(...params: any[]): this

  all(callback?: (err: Error | null, rows: any[]) => void): this
  all(params: any, callback?: (this: RawSqlite3Result, err: Error | null, rows: any[]) => void): this
  all(...params: any[]): this

  each(callback?: (err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this
  each(params: any, callback?: (this: RawSqlite3Result, err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this
  each(...params: any[]): this
}

export interface RawSqlite3Database {

  close(callback?: (err: Error | null) => void): void

  run(sql: string, callback?: (this: RawSqlite3Result, err: Error | null) => void): this
  run(sql: string, params: any, callback?: (this: RawSqlite3Result, err: Error | null) => void): this
  run(sql: string, ...params: any[]): this

  get(sql: string, callback?: (this: RawSqlite3Statement, err: Error | null, row: any) => void): this
  get(sql: string, params: any, callback?: (this: RawSqlite3Statement, err: Error | null, row: any) => void): this
  get(sql: string, ...params: any[]): this

  all(sql: string, callback?: (this: RawSqlite3Statement, err: Error | null, rows: any[]) => void): this
  all(sql: string, params: any, callback?: (this: RawSqlite3Statement, err: Error | null, rows: any[]) => void): this
  all(sql: string, ...params: any[]): this

  each(sql: string, callback?: (this: RawSqlite3Statement, err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this
  each(sql: string, params: any, callback?: (this: RawSqlite3Statement, err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this
  each(sql: string, ...params: any[]): this

  exec(sql: string, callback?: (this: RawSqlite3Statement, err: Error | null) => void): this

  prepare(sql: string, callback?: (this: RawSqlite3Statement, err: Error | null) => void): RawSqlite3Statement
  prepare(sql: string, params: any, callback?: (this: RawSqlite3Statement, err: Error | null) => void): RawSqlite3Statement
  prepare(sql: string, ...params: any[]): RawSqlite3Statement

  serialize(callback?: () => void): void
  parallelize(callback?: () => void): void

  interrupt(): void
}
