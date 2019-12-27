import { PoolConnection as OriginPoolConnection } from 'mysql'

import { PoolConnection } from '../../interfaces/database'
import { MysqlConnection } from './connection'


export class MysqlPoolConnection extends MysqlConnection implements PoolConnection {

  public constructor(public connection: OriginPoolConnection) {
    super(connection)
  }

  public release(): Promise<void> {
    this.connection.release()
    return Promise.resolve()
  }
}
