import {
  RawMysqlConnection,
  RawMysqlError,
  RawMysqlFieldInfo,
  RawMysqlPoolConnection,
  RawMysqlPoolOptions,
  RawMysqlQueryOptions,
} from '../mysql/interfaces'

/*
 * ref. https://github.com/types/mysql2/blob/master/index.d.ts
 */

export interface RawMysql2PoolOptions extends RawMysqlPoolOptions {
  charsetNumber?: number
  compress?: boolean
  authSwitchHandler?: (data: any, callback: () => void) => any
  connectAttributes?: { [param: string]: any }
  decimalNumbers?: boolean
  isServer?: boolean
  maxPreparedStatements?: number
  namedPlaceholders?: boolean
  nestTables?: boolean | string
  passwordSha1?: string
  pool?: any
  rowsAsArray?: boolean
  stream?: any
  uri?: string
  connectionLimit?: number
  Promise?: any
  queueLimit?: number
  waitForConnections?: boolean
}

export interface RawMysql2Connection extends RawMysqlConnection {
  execute(sql: string, callback?: (err: RawMysqlError | null, result: any, fields: RawMysqlFieldInfo[]) => any): any
  execute(sql: string, values: any | any[] | { [param: string]: any }, callback?: (err: RawMysqlError | null, result: any, fields: RawMysqlFieldInfo[]) => any): any
  execute(options: RawMysqlQueryOptions, callback?: (err: RawMysqlError | null, result: any, fields?: RawMysqlFieldInfo[]) => any): any
  execute(options: RawMysqlQueryOptions, values: any | any[] | { [param: string]: any }, callback?: (err: RawMysqlError | null, result: any, fields: RawMysqlFieldInfo[]) => any): any
}

export interface RawMysql2PoolConnection extends RawMysql2Connection, RawMysqlPoolConnection {
}

export interface RawMysql2Pool extends RawMysqlConnection {
  execute(sql: string, callback?: (err: RawMysqlError | null, result: any, fields: RawMysqlFieldInfo[]) => any): any
  execute(sql: string, values: any | any[] | { [param: string]: any }, callback?: (err: RawMysqlError | null, result: any, fields: RawMysqlFieldInfo[]) => any): any
  execute(options: RawMysqlQueryOptions, callback?: (err: RawMysqlError | null, result: any, fields?: RawMysqlFieldInfo[]) => any): any
  execute(options: RawMysqlQueryOptions, values: any | any[] | { [param: string]: any }, callback?: (err: RawMysqlError | null, result: any, fields: RawMysqlFieldInfo[]) => any): any
  getConnection(callback: (err: NodeJS.ErrnoException, connection: RawMysql2PoolConnection) => any): void
}
