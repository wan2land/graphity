import { ConnectionConfig, PoolConfig } from 'pg'

export interface PgConnectorOptions extends ConnectionConfig {
  readonly pool?: false
}

export interface PgPoolConnectorOptions extends PoolConfig {
  readonly pool: true
}
