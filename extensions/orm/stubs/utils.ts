import { exec } from 'child_process'

import { createMysqlPool } from '../src/driver/mysql/create-pool'
import { createMysql2Pool } from '../src/driver/mysql2/create-pool'
import { createPgPool } from '../src/driver/pg/create-pool'
import { createSqlite3Pool } from '../src/driver/sqlite3/create-pool'
import { Pool } from '../src/interfaces/database'

const dockercache = new Map<string, [string, number]>()
function getDockerComposePort(service: string, port: number): Promise<[string, number]> {
  const cachekey = `${service}___${port}`
  return new Promise((resolve, reject) => {
    if (dockercache.has(cachekey)) {
      return resolve(dockercache.get(cachekey))
    }
    exec(`docker-compose port ${service} ${port}`, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      const chunks = stdout.trim().split(':')
      const result: [string, number] = [chunks[0], parseInt(chunks[1], 10)]
      dockercache.set(cachekey, result)
      resolve(result)
    })
  })
}

export type Testcase = 'mysql' | 'mysql2' | 'pg' | 'sqlite3'

export async function createPool(testcase: Testcase): Promise<Pool> {
  if (testcase === 'mysql') {
    const [_, mariadb100Port] = await getDockerComposePort('mariadb', 3306)

    const connection = createMysqlPool({
      host: 'localhost',
      port: mariadb100Port,
      user: 'root',
      password: 'mariadb',
      database: 'graphity_database',
    })
    await connection.query('DROP TABLE IF EXISTS `tests_mysql`')
    await connection.query('CREATE TABLE `tests_mysql`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
    return connection
  }
  if (testcase === 'mysql2') {
    const [_, mariadb100Port] = await getDockerComposePort('mariadb', 3306)

    const connection = createMysql2Pool({
      host: 'localhost',
      port: mariadb100Port,
      user: 'root',
      password: 'mariadb',
      database: 'graphity_database',
    })
    await connection.query('DROP TABLE IF EXISTS `tests_mysql2`')
    await connection.query('CREATE TABLE `tests_mysql2`(`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `text` varchar(20) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
    return connection
  }
  if (testcase === 'pg') {
    const [_, postgres96Port] = await getDockerComposePort('postgres', 5432)

    const connection = createPgPool({
      host: 'localhost',
      port: postgres96Port,
      user: 'postgres',
      password: 'postgres',
      database: 'graphity_database',
    })
    await connection.query('DROP TABLE IF EXISTS tests_pg')
    await connection.query('CREATE TABLE tests_pg(id serial PRIMARY KEY, text varchar(20) DEFAULT NULL)')
    return connection
  }
  if (testcase === 'sqlite3') {
    const connection = createSqlite3Pool(':memory:')
    await connection.query('DROP TABLE IF EXISTS tests_sqlite3')
    await connection.query('CREATE TABLE tests_sqlite3(id INTEGER PRIMARY KEY, text TEXT)')
    return connection
  }
  throw new Error(`unknown testcase ${testcase}`)
}
