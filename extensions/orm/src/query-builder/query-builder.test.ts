import { Compiler } from './compiler'
import { QueryBuilder } from './query-builder'

describe('testsuite of query-builder/builder', () => {
  it('test select', () => {
    const qb = new QueryBuilder('users').select('*').where('group', 'hello').orderByDesc('id').limit(10)
    expect(new Compiler().compile(qb)).toEqual({
      sql: 'select * from users where group = ? order by id desc limit ?',
      bindings: ['hello', 10],
    })
  })


  it('test insert single', () => {
    const qb = new QueryBuilder('users').insert({
      name: 'wan2land',
      email: 'wan2land@gmail.com',
    })
    expect(new Compiler().compile(qb)).toEqual({
      sql: 'insert into users(name, email) values (?, ?)',
      bindings: ['wan2land', 'wan2land@gmail.com'],
    })
  })

  it('test insert multiple', () => {
    const qb = new QueryBuilder('users').insert([
      {
        name: 'wan3land',
        email: 'wan3land@gmail.com',
      },
      {
        name: 'wan4land',
        email: 'wan4land@gmail.com',
        instagram: 'wan4land',
      },
      {
        name: 'wan5land',
        facebook: 'wan5land',
      },
    ])
    expect(new Compiler().compile(qb)).toEqual({
      sql: 'insert into users(name, email, instagram, facebook) values (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)',
      bindings: ['wan3land', 'wan3land@gmail.com', null, null, 'wan4land', 'wan4land@gmail.com', 'wan4land', null, 'wan5land', null, null, 'wan5land'],
    })
  })

  it('test update', () => {
    const qb = new QueryBuilder('users').update({ name: 'wan2land' }).where('group', 'hello').orderByDesc('id').limit(10)
    expect(new Compiler().compile(qb)).toEqual({
      sql: 'update users set name = ? where group = ? order by id desc limit ?',
      bindings: ['wan2land', 'hello', 10],
    })
  })

  it('test delete', () => {
    const qb = new QueryBuilder('users').delete().where('group', 'hello').orderByDesc('id').limit(10)
    expect(new Compiler().compile(qb)).toEqual({
      sql: 'delete from users where group = ? order by id desc limit ?',
      bindings: ['hello', 10],
    })
  })
})
