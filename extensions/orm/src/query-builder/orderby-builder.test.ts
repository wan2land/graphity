import { Compiler } from './compiler'
import { OrderByBuilder } from './orderby-builder'

describe('testsuite of query-builder/orderby-builder', () => {
  it('test orderBy', () => {
    const qb = new OrderByBuilder()

    qb.orderBy('col1')
      .orderByAsc('col2')
      .orderByDesc('col3')
      .orderBy('col4')

    expect(new Compiler().compile({ table: 'users', method: 'select', ...qb })).toEqual({
      sql: 'select * from users order by col1, col2, col3 desc, col4',
      bindings: [],
    })
  })
})
