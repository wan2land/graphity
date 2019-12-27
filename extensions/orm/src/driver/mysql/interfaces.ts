import { ConnectionConfig, PoolConfig } from 'mysql'

export interface MysqlConnectorOptions extends ConnectionConfig {
  readonly pool?: false
}

export interface MysqlPoolConnectorOptions extends PoolConfig {
  readonly pool: true
}
