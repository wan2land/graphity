import { PoolConnection as OriginPoolConnection } from 'mysql2'

import { PoolConnection } from '../../interfaces/database'
import { Mysql2Connection } from './connection'


export class Mysql2PoolConnection extends Mysql2Connection implements PoolConnection {

  public constructor(public connection: OriginPoolConnection) {
    super(connection)
  }

  public release(): Promise<void> {
    this.connection.release()
    return Promise.resolve()
  }
}
