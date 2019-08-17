import { MysqlQueryResolver } from '../../../lib/dialects/mysql/query-resolver'
import { sql } from '../../../lib/query/sql'

describe('testsuite of dialects/mysql/query-resolver', () => {

  const resolver = new MysqlQueryResolver()

  it('test resolve simple', async () => {
    expect(resolver.resolve(sql`SELECT * FROM articles`)).toEqual({
      query: 'SELECT * FROM articles',
      bindings: [],
    })
  })

  it('test resolve with placeholders', async () => {
    expect(resolver.resolve(sql`SELECT * FROM articles WHERE id = ${30} and title = ${'title'}`)).toEqual({
      query: 'SELECT * FROM articles WHERE id = ? and title = ?',
      bindings: [30, 'title'],
    })
  })

  it('test resolve recursive', async () => {
    expect(resolver.resolve(sql`SELECT * FROM articles WHERE (id = ${1} or id in (${sql`SELECT article_id FROM comments WHERE id = ${30}`})) and title = ${'title'}`)).toEqual({
      query: 'SELECT * FROM articles WHERE (id = ? or id in (SELECT article_id FROM comments WHERE id = ?)) and title = ?',
      bindings: [1, 30, 'title'],
    })
  })
})
