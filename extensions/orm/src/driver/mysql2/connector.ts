import { createConnection, createPool } from 'mysql2'

import { Connection, Connector } from '../../interfaces/database'
import { Mysql2Connection } from './connection'
import { Mysql2ConnectorOptions, Mysql2PoolConnectorOptions } from './interfaces'
import { Mysql2Pool } from './pool'


export class Mysql2Connector implements Connector {

  public constructor(public options: Mysql2ConnectorOptions | Mysql2PoolConnectorOptions) {
  }

  public connect(): Connection {
    const { pool, ...options } = this.options
    if (pool) {
      return new Mysql2Pool(createPool(options))
    }
    return new Mysql2Connection(createConnection(options))
  }
}
