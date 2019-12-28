/* eslint-disable @typescript-eslint/camelcase */
import { Article } from '../../stubs/article'
import { Something } from '../../stubs/something'
import { ColumnType, ValueTransformer } from '../interfaces/common'
import { Hydrator } from './hydrator'


describe('testsuite of hydration/hydrator', () => {

  const hydrator = new Hydrator({
    ctor: Article,
    columns: [
      {
        property: 'id' as keyof Article,
        name: 'id',
        nullable: false,
        type: ColumnType.Int,
        transformers: [],
      },
      {
        property: 'title' as keyof Article,
        name: 'title',
        nullable: false,
        type: ColumnType.String,
        transformers: [],
      },
      {
        property: 'contents' as keyof Article,
        name: 'contents',
        nullable: true,
        type: ColumnType.String,
        transformers: [],
      },
      {
        property: 'createdAt' as keyof Article,
        name: 'created_at',
        nullable: false,
        type: ColumnType.String,
        transformers: [],
      },
    ],
  })

  it('test hydrate one', () => {

    const article1 = hydrator.hydrate({ id: '10', title: 'this is 10', created_at: '2019-03-01 00:00:00' })

    expect(article1).toEqual({ id: 10, title: 'this is 10', contents: null, createdAt: '2019-03-01 00:00:00' })
    expect(article1).toBeInstanceOf(Article)

    const article2 = hydrator.hydrate({ id: 11, title: 'this is 11', created_at: '2019-03-01 00:00:00' })

    expect(article2).toEqual({ id: 11, title: 'this is 11', contents: null, createdAt: '2019-03-01 00:00:00' })
    expect(article2).toBeInstanceOf(Article)
  })

  it('test hydrate many', () => {
    const articles = hydrator.hydrate([
      { id: '10', title: 'this is 10', created_at: '2019-03-01 00:00:00' },
      { id: 11, title: 'this is 11', created_at: '2019-03-01 00:00:00' },
    ])

    expect(articles).toEqual([
      { id: 10, title: 'this is 10', contents: null, createdAt: '2019-03-01 00:00:00' },
      { id: 11, title: 'this is 11', contents: null, createdAt: '2019-03-01 00:00:00' },
    ])

    const mockIter = jest.fn(row => expect(row).toBeInstanceOf(Article))
    articles.map(mockIter)
    expect(mockIter).toBeCalledTimes(2)
  })

  it('test nullable and default', () => {
    // not null
    const nonnull1 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: false,
          transformers: [],
        },
      ],
    })
    expect(nonnull1.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(() => nonnull1.hydrate({})).toThrowError(new Error('column(id) is not nullable.'))


    // not null + default scalar
    const nonnull2 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: false,
          default: 10,
          transformers: [],
        },
      ],
    })
    expect(nonnull2.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(nonnull2.hydrate({})).toEqual({ id: 10 })

    // not null + default handler
    const nonnull3 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: false,
          default: () => 10,
          transformers: [],
        },
      ],
    })
    expect(nonnull3.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(nonnull3.hydrate({})).toEqual({ id: 10 })

    // not null + default null
    const nonnull4 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: false,
          default: null,
          transformers: [],
        },
      ],
    })
    expect(nonnull4.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(() => nonnull4.hydrate({})).toThrowError(new Error('column(id) is not nullable.'))

    // not null + default null generator
    const nonnull5 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: false,
          default: () => null,
          transformers: [],
        },
      ],
    })
    expect(nonnull5.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(() => nonnull5.hydrate({})).toThrowError(new Error('column(id) is not nullable.'))

    // not null + default undefined
    const nonnull6 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: false,
          default: undefined,
          transformers: [],
        },
      ],
    })
    expect(nonnull6.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(() => nonnull6.hydrate({})).toThrowError(new Error('column(id) is not nullable.'))

    // not null + default undefined generator
    const nonnull7 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: false,
          default: () => undefined,
          transformers: [],
        },
      ],
    })
    expect(nonnull7.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(() => nonnull7.hydrate({})).toThrowError(new Error('column(id) is not nullable.'))


    // null
    const nullable1 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: true,
          transformers: [],
        },
      ],
    })
    expect(nullable1.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(nullable1.hydrate({})).toEqual({ id: null })

    // null + default scalar
    const nullable2 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: true,
          default: 10,
          transformers: [],
        },
      ],
    })
    expect(nullable2.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(nullable2.hydrate({})).toEqual({ id: 10 })

    // null + default handler
    const nullable3 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: true,
          default: () => 10,
          transformers: [],
        },
      ],
    })
    expect(nullable3.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(nullable3.hydrate({})).toEqual({ id: 10 })

    // null + default null
    const nullable4 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: true,
          default: null,
          transformers: [],
        },
      ],
    })
    expect(nullable4.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(nullable4.hydrate({})).toEqual({ id: null })

    // null + default null handler
    const nullable5 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: true,
          default: () => null,
          transformers: [],
        },
      ],
    })
    expect(nullable5.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(nullable5.hydrate({})).toEqual({ id: null })

    // null + default null
    const nullable6 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: true,
          default: undefined,
          transformers: [],
        },
      ],
    })
    expect(nullable6.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(nullable6.hydrate({})).toEqual({ id: null })

    // null + default null handler
    const nullable7 = new Hydrator({
      ctor: Something,
      columns: [
        {
          property: 'id' as keyof Something,
          name: 'id',
          type: ColumnType.Int,
          nullable: true,
          default: () => undefined,
          transformers: [],
        },
      ],
    })
    expect(nullable7.hydrate({ id: 1 })).toEqual({ id: 1 })
    expect(nullable7.hydrate({})).toEqual({ id: null })
  })
})
