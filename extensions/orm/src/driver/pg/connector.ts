import { Client, Pool } from 'pg'

import { Connection, Connector } from '../../interfaces/database'
import { PgConnection } from './connection'
import { PgConnectorOptions, PgPoolConnectorOptions } from './interfaces'
import { PgPool } from './pool'


export class PgConnector implements Connector {

  public constructor(public options: PgConnectorOptions | PgPoolConnectorOptions) {
  }

  public connect(): Connection {
    const { pool, ...options } = this.options
    if (pool) {
      return new PgPool(new Pool(options))
    }
    return new PgConnection(new Client(options))
  }
}
