import { Column, Entity, Id } from '../../../lib'
import { Connection } from '../../../lib/connection/connection'
import { MysqlRepository } from '../../../lib/dialects/mysql/repository'

@Entity({ name: 'articles' })
class Article {
  @Id() @Column({ type: 'int' })
  public id!: number

  @Column({ type: 'string' })
  public title!: string

  @Column({ type: 'string', nullable: true })
  public contents!: number | null

  @Column({ type: 'string', name: 'created_at' })
  public createdAt!: string
}

describe('testsuite of dialects/mysql/repository', () => {
  it('test create mysql repository', () => {
    const mock = jest.genMockFromModule<{Connection: any}>('@stdjs/database').Connection
    const connection = new Connection(mock, {
      dialect: 'mysql',
    })
    const repository = connection.getRepository(Article)
    expect(repository).toBeInstanceOf(MysqlRepository)
  })

  it('test findById', async () => {
    const mock = {} as any
    const mockFirstMethod = mock.first = jest.fn()

    const connection = new Connection(mock, {
      dialect: 'mysql',
    })
    const repository = connection.getRepository(Article)

    await repository.findById(1)
    await repository.findById(2)

    expect(mockFirstMethod.mock.calls).toEqual([
      ['SELECT * FROM `articles` WHERE `id` = ? LIMIT 1', [1]],
      ['SELECT * FROM `articles` WHERE `id` = ? LIMIT 1', [2]],
    ])
  })

  it('test findById parallels', async () => {
    const mock = {} as any
    const mockSelectMethod = mock.select = jest.fn(() => [])

    const connection = new Connection(mock, {
      dialect: 'mysql',
    })
    const repository = connection.getRepository(Article)

    await Promise.all([
      repository.findById(1),
      repository.findById(2),
      repository.findById(3),
    ])

    expect(mockSelectMethod.mock.calls).toEqual([
      ['SELECT * FROM `articles` WHERE `id` IN (?, ?, ?)', [1, 2, 3]],
    ])
  })
})
