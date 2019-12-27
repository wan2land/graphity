import { WhereBuilder } from './where-builder'
import { Compiler } from './compiler'

describe('testsuite of query-builder/where-builder', () => {
  it('test where', () => {
    const qb = new WhereBuilder()

    qb.where('col1', 'string1')
      .orWhere('col2', 'like', '%string2%')
      .where('col3', '=', true)
      .orWhere('col4', '!=', false)
      .where('col5', '>', 10)
      .orWhere('col6', '<', 20)
      .where('col7', '>=', 30)
      .orWhere('col8', '<=', 40)

    expect(new Compiler().compile({ table: 'users', method: 'select', ...qb })).toEqual({
      sql: 'select * from users where col1 = ? or col2 like ? and col3 = ? or col4 != ? and col5 > ? or col6 < ? and col7 >= ? or col8 <= ?',
      bindings: ['string1', '%string2%', true, false, 10, 20, 30, 40],
    })
  })

  it('test whereIn', () => {
    const qb = new WhereBuilder()

    qb.whereIn('col1', [1, 2, 3])
      .orWhereIn('col2', ['string1', 'string2'])
      .whereIn('col3', [])
      .orWhereIn('col4', [])

    expect(new Compiler().compile({ table: 'users', method: 'select', ...qb })).toEqual({
      sql: 'select * from users where col1 in (?, ?, ?) or col2 in (?, ?) and 1 = 2 or 1 = 2',
      bindings: [1, 2, 3, 'string1', 'string2'],
    })
  })

  it('test whereNotIn', () => {
    const qb = new WhereBuilder()

    qb.whereNotIn('col1', [1, 2, 3])
      .orWhereNotIn('col2', ['string1', 'string2'])
      .whereNotIn('col3', [])
      .orWhereNotIn('col4', [])

    expect(new Compiler().compile({ table: 'users', method: 'select', ...qb })).toEqual({
      sql: 'select * from users where col1 not in (?, ?, ?) or col2 not in (?, ?) and 1 = 1 or 1 = 1',
      bindings: [1, 2, 3, 'string1', 'string2'],
    })
  })

  it('test whereNull/whereNotNull', () => {
    const qb = new WhereBuilder()

    qb.whereNull('col1')
      .orWhereNull('col2')
      .whereNotNull('col3')
      .orWhereNotNull('col4')

    expect(new Compiler().compile({ table: 'users', method: 'select', ...qb })).toEqual({
      sql: 'select * from users where col1 is null or col2 is null and col3 is not null or col4 is not null',
      bindings: [],
    })
  })
})
