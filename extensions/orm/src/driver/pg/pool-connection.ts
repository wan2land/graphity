import { PoolClient } from 'pg'

import { PoolConnection, TransactionHandler } from '../../interfaces/database'
import { PgBaseConnection } from './base-connection'


export class PgPoolConnection extends PgBaseConnection implements PoolConnection {

  public constructor(public client: PoolClient) {
    super(client)
  }


  public close(): Promise<void> {
    if ((this.client as any)._connected) {
      return Promise.resolve(this.client.release())
    }
    return Promise.resolve()
  }

  public async transaction<TRow>(handler: TransactionHandler<TRow>): Promise<TRow> {
    await this.query('BEGIN')
    try {
      const result = await handler(this)
      await this.query('COMMIT')
      return result
    } catch (e) {
      await this.query('ROLLBACK')
      throw e
    }
  }

  public release(): Promise<void> {
    return Promise.resolve(this.client.release())
  }
}
