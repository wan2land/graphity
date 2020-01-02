import { RawMysql2PoolOptions } from './interfaces'
import { Mysql2Pool } from './pool'


export function createMysql2Pool(options: RawMysql2PoolOptions): Mysql2Pool {
  return new Mysql2Pool(require('mysql2').createPool(options)) // eslint-disable-line @typescript-eslint/no-require-imports
}
