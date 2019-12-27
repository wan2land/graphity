import { Database } from 'sqlite3'

import { Connection, Connector } from '../../interfaces/database'
import { Sqlite3Connection } from './connection'
import { Sqlite3ConnectorOptions } from './interfaces'


export class Sqlite3Connector implements Connector {

  public constructor(public options: Sqlite3ConnectorOptions) {
  }

  public connect(): Connection {
    return new Sqlite3Connection(new Database(this.options.filename, this.options.mode))
  }
}
