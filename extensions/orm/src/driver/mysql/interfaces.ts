/*
 * ref. https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mysql/index.d.ts
 */

export interface RawMysqlPool {
  getConnection(callback: (err: RawMysqlError | null, connection: RawMysqlPoolConnection) => void): void
  end(callback?: (err: RawMysqlError | null) => void): void

  query(options: string | RawMysqlQueryOptions, callback?: RawMysqlQueryCb): any
  query(options: string, values: any, callback?: RawMysqlQueryCb): any
}

export interface RawMysqlPoolOptions {
  acquireTimeout?: number
  waitForConnections?: boolean
  connectionLimit?: number
  queueLimit?: number

  host?: string
  port?: number
  user?: string
  password?: string
  database?: string

  localAddress?: string
  socketPath?: string
  timezone?: string
  connectTimeout?: number
  stringifyObjects?: boolean
  insecureAuth?: boolean
  supportBigNumbers?: boolean
  bigNumberStrings?: boolean

  /**
   * Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather then inflated into JavaScript
   * Date objects. Can be true/false or an array of type names to keep as strings. (Default: false)
   */
  dateStrings?: boolean | ('TIMESTAMP' | 'DATETIME' | 'DATE')[]

  debug?: boolean

  trace?: boolean

  multipleStatements?: boolean

  flags?: string | string[]

  charset?: string
  timeout?: number
}

export interface RawMysqlConnection {

  state: 'connected' | 'authenticated' | 'disconnected' | 'protocol_error' | string

  threadId: number | null

  connect(callback?: (err: RawMysqlError | null, ...args: any[]) => void): void

  connect(options: any, callback?: (err: RawMysqlError | null, ...args: any[]) => void): void

  beginTransaction(options?: RawMysqlQueryOptions, callback?: (err: RawMysqlError | null) => void): void

  beginTransaction(callback: (err: RawMysqlError | null) => void): void

  commit(options?: RawMysqlQueryOptions, callback?: (err: RawMysqlError | null) => void): void
  commit(callback: (err: RawMysqlError | null) => void): void

  rollback(options?: RawMysqlQueryOptions, callback?: (err: RawMysqlError | null) => void): void
  rollback(callback: (err: RawMysqlError | null) => void): void

  query(options: string | RawMysqlQueryOptions, callback?: RawMysqlQueryCb): any
  query(options: string, values: any, callback?: RawMysqlQueryCb): any

  ping(options?: RawMysqlQueryOptions, callback?: (err: RawMysqlError | null) => void): void
  ping(callback: (err: RawMysqlError | null) => void): void

  statistics(options?: RawMysqlQueryOptions, callback?: (err: RawMysqlError | null) => void): void
  statistics(callback: (err: RawMysqlError | null) => void): void

  end(callback?: (err: RawMysqlError | null, ...args: any[]) => void): void
  end(options: any, callback: (err: RawMysqlError | null, ...args: any[]) => void): void

  destroy(): void
  pause(): void
  resume(): void
}

export interface RawMysqlPoolConnection extends RawMysqlConnection {
  release(): void
}

export type RawMysqlQueryCb = (err: RawMysqlError | null, results?: any, fields?: RawMysqlFieldInfo[]) => void

export interface RawMysqlQueryOptions {
  sql: string
  values?: any
  timeout?: number
  nestTables?: any
}

export interface RawMysqlError extends Error {
  code: string
  errno: number
  sqlStateMarker?: string
  sqlState?: string
  fieldCount?: number
  stack?: string
  fatal: boolean
  sql?: string
  sqlMessage?: string
}

export const enum RawMysqlTypes {
  DECIMAL = 0x00, // aka DECIMAL (http://dev.mysql.com/doc/refman/5.0/en/precision-math-decimal-changes.html)
  TINY = 0x01, // aka TINYINT, 1 byte
  SHORT = 0x02, // aka SMALLINT, 2 bytes
  LONG = 0x03, // aka INT, 4 bytes
  FLOAT = 0x04, // aka FLOAT, 4-8 bytes
  DOUBLE = 0x05, // aka DOUBLE, 8 bytes
  NULL = 0x06, // NULL (used for prepared statements, I think)
  TIMESTAMP = 0x07, // aka TIMESTAMP
  LONGLONG = 0x08, // aka BIGINT, 8 bytes
  INT24 = 0x09, // aka MEDIUMINT, 3 bytes
  DATE = 0x0A, // aka DATE
  TIME = 0x0B, // aka TIME
  DATETIME = 0x0C, // aka DATETIME
  YEAR = 0x0D, // aka YEAR, 1 byte (don't ask)
  NEWDATE = 0x0E, // aka ?
  VARCHAR = 0x0F, // aka VARCHAR (?)
  BIT = 0x10, // aka BIT, 1-8 byte
  TIMESTAMP2 = 0x11, // aka TIMESTAMP with fractional seconds
  DATETIME2 = 0x12, // aka DATETIME with fractional seconds
  TIME2 = 0x13, // aka TIME with fractional seconds
  JSON = 0xF5, // aka JSON
  NEWDECIMAL = 0xF6, // aka DECIMAL
  ENUM = 0xF7, // aka ENUM
  SET = 0xF8, // aka SET
  TINY_BLOB = 0xF9, // aka TINYBLOB, TINYTEXT
  MEDIUM_BLOB = 0xFA, // aka MEDIUMBLOB, MEDIUMTEXT
  LONG_BLOB = 0xFB, // aka LONGBLOG, LONGTEXT
  BLOB = 0xFC, // aka BLOB, TEXT
  VAR_STRING = 0xFD, // aka VARCHAR, VARBINARY
  STRING = 0xFE, // aka CHAR, BINARY
  GEOMETRY = 0xFF, // aka GEOMETRY
}

export interface RawMysqlFieldInfo {
  catalog: string
  db: string
  table: string
  orgTable: string
  name: string
  orgName: string
  charsetNr: number
  length: number
  type: RawMysqlTypes
  flags: number
  decimals: number
  default?: string
  zeroFill: boolean
  protocol41: boolean
}
