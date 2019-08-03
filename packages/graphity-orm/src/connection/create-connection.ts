import { Connector, createConnection as createAdapterConnection } from '@stdjs/database'

import { Connection } from './connection'

export function createConnection(connector: Connector) {
  return new Connection(createAdapterConnection(connector), {
    dialect: connector.dialect,
  })
}
