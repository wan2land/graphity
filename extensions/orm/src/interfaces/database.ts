
export interface Connector {
  connect(): Connection
}

export interface Pool extends Connection {
  getConnection(): Promise<PoolConnection>
}

export interface PoolConnection extends Connection {
  release(): Promise<void>
}

export interface Connection {
  close(): Promise<void>
  select<TRow extends Record<string, any>>(query: string, values?: any[]): Promise<TRow[]>
  query(query: string, values?: any[]): Promise<QueryResult>
  transaction<TResult>(handler: TransactionHandler<TResult>): Promise<TResult>
}

export type TransactionHandler<TResult> = (connection: Connection) => Promise<TResult> | TResult

export interface QueryResult {
  insertId?: number|string // insert query only
  changes: number
  raw: any
}
