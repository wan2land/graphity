/*
 * ref. https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pg/index.d.ts
 */

export interface RawPgPoolOptions {
  max?: number
  min?: number
  connectionTimeoutMillis?: number
  idleTimeoutMillis?: number
  log?: (...messages: any[]) => void

  application_name?: string

  user?: string
  database?: string
  password?: string
  port?: number
  host?: string
  connectionString?: string
  keepAlive?: boolean
  statement_timeout?: false | number
  query_timeout?: number
  keepAliveInitialDelayMillis?: number
}

export interface RawPgQueryConfig {
  name?: string
  text: string
  values?: any[]
}

export interface RawPgFieldInfo {
  name: string
  tableID: number
  columnID: number
  dataTypeID: number
  dataTypeSize: number
  dataTypeModifier: number
  format: string
}

export interface RawPgQueryResult {
  rows: Record<string, any>[]
  command: string
  rowCount: number
  oid: number
  fields: RawPgFieldInfo[]
}

export interface RawPgPool {

  readonly totalCount: number
  readonly idleCount: number
  readonly waitingCount: number

  connect(): Promise<RawPgPoolConnection>
  connect(callback: (err: Error, client: RawPgPoolConnection, done: (release?: any) => void) => void): void

  end(): Promise<void>
  end(callback: () => void): void

  query(queryConfig: RawPgQueryConfig): Promise<RawPgQueryResult>
  query(queryTextOrConfig: string | RawPgQueryConfig, values?: any[]): Promise<RawPgQueryResult>
}

export interface RawPgPoolConnection {
  release(err?: Error): void

  connect(): Promise<void>
  connect(callback: (err: Error) => void): void

  query(queryConfig: RawPgQueryConfig): Promise<RawPgQueryResult>
  query(queryTextOrConfig: string | RawPgQueryConfig, values?: any[]): Promise<RawPgQueryResult>

  escapeIdentifier(str: string): string
  escapeLiteral(str: string): string
}
