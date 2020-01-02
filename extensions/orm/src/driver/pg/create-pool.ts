import { RawPgPoolOptions } from './interfaces'
import { PgPool } from './pool'


export function createPgPool(options: RawPgPoolOptions): PgPool {
  const Pool = require('pg').Pool // eslint-disable-line @typescript-eslint/no-require-imports
  return new PgPool(new Pool(options))
}
