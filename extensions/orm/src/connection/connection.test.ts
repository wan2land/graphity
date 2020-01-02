import { createPool, Testcase } from '../../stubs/utils'


const testcases: Testcase[] = [
  'mysql',
  'mysql2',
  'pg',
  'sqlite3',
]

const insertOneSqls: {[testcase: string]: string} = {
  mysql: 'INSERT INTO `tests_mysql`(`text`) VALUE ("hello1")',
  mysql2: 'INSERT INTO `tests_mysql2`(`text`) VALUE ("hello1")',
  pg: 'INSERT INTO tests_pg(text) VALUES (\'hello1\') RETURNING id', // not exists VALUE
  sqlite3: 'INSERT INTO tests_sqlite3(text) VALUES ("hello1")', // not exists VALUE
}

const insertManySqls: {[testcase: string]: [string, string[]]} = {
  mysql: ['INSERT INTO `tests_mysql`(`text`) VALUES (?), (?)', ['hello2', 'hello3']],
  mysql2: ['INSERT INTO `tests_mysql2`(`text`) VALUES (?), (?)', ['hello2', 'hello3']],
  pg: ['INSERT INTO tests_pg(text) VALUES ($1), ($2) RETURNING id', ['hello2', 'hello3']],
  sqlite3: ['INSERT INTO tests_sqlite3(text) VALUES (?), (?)', ['hello2', 'hello3']],
}

const updateSqls: {[testcase: string]: [string, any[]]} = {
  mysql: ['UPDATE `tests_mysql` SET `text` = ?', ['updated!']],
  mysql2: ['UPDATE `tests_mysql2` SET `text` = ?', ['updated!']],
  pg: ['UPDATE tests_pg SET text = $1', ['updated!']], // not exists VALUE
  sqlite3: ['UPDATE tests_sqlite3 SET text = ?', ['updated!']], // not exists VALUE
}

const deleteSqls: {[testcase: string]: string} = {
  mysql: 'DELETE FROM `tests_mysql`',
  mysql2: 'DELETE FROM `tests_mysql2`',
  pg: 'DELETE FROM tests_pg', // not exists VALUE
  sqlite3: 'DELETE FROM tests_sqlite3', // not exists VALUE
}

const insertNullSqls: {[testcase: string]: [string, any[]]} = {
  mysql: ['INSERT INTO `tests_mysql`(`text`) VALUES (?), (?)', [null, undefined]],
  mysql2: ['INSERT INTO `tests_mysql2`(`text`) VALUES (?), (?)', [null, undefined]],
  pg: ['INSERT INTO tests_pg(text) VALUES ($1), ($2) RETURNING id', [null, undefined]],
  sqlite3: ['INSERT INTO tests_sqlite3(text) VALUES (?), (?)', [null, undefined]],
}

const selectSqls: {[testcase: string]: string} = {
  mysql: 'SELECT * FROM `tests_mysql` ORDER BY `id`',
  mysql2: 'SELECT * FROM `tests_mysql2` ORDER BY `id`',
  pg: 'SELECT * FROM tests_pg ORDER BY id',
  sqlite3: 'SELECT * FROM tests_sqlite3 ORDER BY id',
}

describe('testsuite of connection', () => {
  for (const testcase of testcases) {
    it(`test insert on ${testcase}`, async () => {
      const pool = await createPool(testcase)
      try {
        const resultOne = await pool.query(insertOneSqls[testcase])
        expect(resultOne.insertId).toEqual(1)
        expect(resultOne.changes).toEqual(1)

        const resultMany = await pool.query(insertManySqls[testcase][0], insertManySqls[testcase][1])
        if (testcase === 'sqlite3') {
          // sqlite return last id
          expect(resultMany.insertId).toEqual(3)
        } else {
          // else return first id
          expect(resultMany.insertId).toEqual(2)
        }
        expect(resultMany.changes).toEqual(2)

        await pool.close()
      } catch (e) {
        await pool.close()
        throw e
      }
    })

    it(`test update on ${testcase}`, async () => {
      const pool = await createPool(testcase)
      try {
        await pool.query(insertManySqls[testcase][0], insertManySqls[testcase][1])

        const result = await pool.query(updateSqls[testcase][0], updateSqls[testcase][1])

        expect(result.insertId).toBeUndefined()
        expect(result.changes).toEqual(2)

        await pool.close()
      } catch (e) {
        await pool.close()
        throw e
      }
    })

    it(`test delete on ${testcase}`, async () => {
      const pool = await createPool(testcase)
      try {
        await pool.query(insertManySqls[testcase][0], insertManySqls[testcase][1])

        const result = await pool.query(deleteSqls[testcase])

        expect(result.insertId).toBeUndefined()
        expect(result.changes).toEqual(2)

        await pool.close()
      } catch (e) {
        await pool.close()
        throw e
      }
    })

    it(`test select on ${testcase}`, async () => {
      const pool = await createPool(testcase)
      try {
        await pool.query(insertOneSqls[testcase])
        await pool.query(insertManySqls[testcase][0], insertManySqls[testcase][1])

        const rows = await pool.select(selectSqls[testcase])

        expect(rows).toEqual([
          { id: 1, text: 'hello1' },
          { id: 2, text: 'hello2' },
          { id: 3, text: 'hello3' },
        ])

        await pool.close()
      } catch (e) {
        await pool.close()
        throw e
      }
    })

    it(`test insert null on ${testcase}`, async () => {
      const pool = await createPool(testcase)

      try {

        await pool.query(insertNullSqls[testcase][0], insertNullSqls[testcase][1])

        const rows = await pool.select(selectSqls[testcase])

        expect(rows).toEqual([
          { id: 1, text: null },
          { id: 2, text: null },
        ])

        await pool.close()
      } catch (e) {
        await pool.close()
        throw e
      }
    })

    it(`test transaction success on ${testcase}`, async () => {
      const pool = await createPool(testcase)
      try {
        const connection = await pool.getConnection()
        await connection.beginTransaction()
        await connection.query(insertOneSqls[testcase])
        await connection.commit()
        await connection.release()

        const rows = await pool.select(selectSqls[testcase])
        expect(rows).toEqual([{ id: 1, text: 'hello1' }])

        await pool.close()
      } catch (e) {
        await pool.close()
        throw e
      }
    })

    it(`test transaction fail on ${testcase}`, async () => {
      const pool = await createPool(testcase)

      try {
        const connection = await pool.getConnection()
        await connection.beginTransaction()
        await connection.query(insertOneSqls[testcase])
        await connection.rollback()
        await connection.release()

        const rows = await pool.select(selectSqls[testcase])
        expect(rows).toEqual([])

        await pool.close()
      } catch (e) {
        await pool.close()
        throw e
      }
    })
  }
})
