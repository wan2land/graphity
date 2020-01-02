
export interface Pool extends BaseConnection {
  getConnection(): Promise<Connection>
  close(): Promise<void>
}

export interface Connection extends BaseConnection {
  release(): Promise<void>
  beginTransaction(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
}

export interface BaseConnection {
  select(query: string, values?: any[]): Promise<Record<string, any>[]>
  query(query: string, values?: any[]): Promise<QueryResult>
}

export type TransactionHandler<TResult> = (connection: BaseConnection) => Promise<TResult> | TResult

export interface QueryResult {
  insertId?: number | string // insert query only
  changes: number
  raw: any
}
