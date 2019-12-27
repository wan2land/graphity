import { ConnectionOptions, PoolOptions } from 'mysql2'

export interface Mysql2ConnectorOptions extends ConnectionOptions {
  readonly pool?: false
}

export interface Mysql2PoolConnectorOptions extends PoolOptions {
  readonly pool: true
}
