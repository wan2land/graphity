import { RawMysqlPoolOptions } from './interfaces'
import { MysqlPool } from './pool'


export function createMysqlPool(options: RawMysqlPoolOptions): MysqlPool {
  return new MysqlPool(require('mysql').createPool(options)) // eslint-disable-line @typescript-eslint/no-require-imports
}
