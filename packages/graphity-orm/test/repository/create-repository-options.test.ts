import { Transformer } from '@graphity/mapper'

import { createRepositoryOptions } from '../../lib/repository/create-repository-options'
import { Entity, Column, Id } from '../../lib'

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

describe('testsuite of repository/create-repository-options', () => {
  it('test stubs/article', () => {
    expect(createRepositoryOptions(Article)).toEqual({
      ctor: Article,
      id: 'id',
      table: 'articles',
      columns: [
        {
          property: 'id',
          sourceKey: 'id',
          nullable: false,
          transformers: [Transformer.INT],
        },
        {
          property: 'title',
          sourceKey: 'title',
          nullable: false,
          transformers: [Transformer.STRING],
        },
        {
          property: 'contents',
          sourceKey: 'contents',
          nullable: true,
          transformers: [Transformer.STRING],
        },
        {
          property: 'createdAt',
          sourceKey: 'created_at',
          nullable: false,
          transformers: [Transformer.STRING],
        },
      ],
    })
  })
})
