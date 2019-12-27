import { Compiler } from './compiler'
import { LimitBuilder } from './limit-builder'

describe('testsuite of query-builder/limit-builder', () => {
  it('test limit', () => {
    const qb = new LimitBuilder()

    qb.limit(10, 20)

    expect(new Compiler().compile({ table: 'users', method: 'select', ...qb })).toEqual({
      sql: 'select * from users limit ?, ?',
      bindings: [10, 20],
    })
  })

  it('test take', () => {
    const qb = new LimitBuilder()

    qb.take(10)

    expect(new Compiler().compile({ table: 'users', method: 'select', ...qb })).toEqual({
      sql: 'select * from users limit ?',
      bindings: [10],
    })
  })

  it('test offset', () => {
    const qb = new LimitBuilder()

    qb.offset(10)

    expect(new Compiler().compile({ table: 'users', method: 'select', ...qb })).toEqual({
      sql: 'select * from users offset ?',
      bindings: [10],
    })
  })
})
