import { isPlainObject } from 'lodash'

import { Mapper } from '../../lib/mapper/mapper'
import { intTransformer } from '../../lib/mapper/transformers/int-transformer'
import { stringTransformer } from '../../lib/mapper/transformers/string-transformer'
import { Article } from '../stubs/article'
import { Something } from '../stubs/something'


describe('testsuite of mapper/transform-to-plain', () => {

  const mapper = new Mapper({
    ctor: Article,
    columns: [
      {
        property: 'id',
        sourceKey: 'id',
        nullable: false,
        transformers: [intTransformer],
      },
      {
        property: 'title',
        sourceKey: 'title',
        nullable: false,
        transformers: [stringTransformer],
      },
      {
        property: 'contents',
        sourceKey: 'contents',
        nullable: true,
        transformers: [stringTransformer],
      },
      {
        property: 'createdAt',
        sourceKey: 'created_at',
        nullable: false,
        transformers: [stringTransformer],
      },
    ],
  })

  it('test toEntity one', () => {

    const article = mapper.toEntity({ id: 10, title: 'this is title', created_at: '2019-03-01 00:00:00' })

    expect(article).toEqual({ id: 10, title: 'this is title', contents: null, createdAt: '2019-03-01 00:00:00' })
    expect(article).toBeInstanceOf(Article)
  })

  it('test toEntity many', async () => {
    const articles = mapper.toEntity([
      { id: 10, title: '', created_at: '2019-03-01 00:00:00' },
      { id: 11, title: 'this is title', created_at: '2019-03-01 00:00:00' },
    ])

    expect(articles).toEqual([
      { id: 10, title: '', contents: null, createdAt: '2019-03-01 00:00:00' },
      { id: 11, title: 'this is title', contents: null, createdAt: '2019-03-01 00:00:00' },
    ])
    articles.map(row => expect(row).toBeInstanceOf(Article))
  })

  it('test toPlain one', async () => {
    // by class
    const article1 = mapper.toPlain(Object.assign(new Article(), { id: 10, title: 'this is title', createdAt: '2019-03-01 00:00:00' }))

    expect(article1).toEqual({ id: 10, title: 'this is title', created_at: '2019-03-01 00:00:00' })
    expect(isPlainObject(article1)).toBeTruthy()


    // by deep partial
    const article2 = mapper.toPlain({ id: 10, title: 'this is title', createdAt: '2019-03-01 00:00:00' })

    expect(article2).toEqual({ id: 10, title: 'this is title', created_at: '2019-03-01 00:00:00' })
    expect(isPlainObject(article2)).toBeTruthy()
  })

  it('test toPlain many', async () => {
    // by class
    const articles1 = mapper.toPlain([
      Object.assign(new Article(), { id: 10, title: '', createdAt: '2019-03-01 00:00:00' }),
      Object.assign(new Article(), { id: 11, title: 'this is title', createdAt: '2019-03-02 00:00:00' }),
    ])

    expect(articles1).toEqual([
      { id: 10, title: '', created_at: '2019-03-01 00:00:00' },
      { id: 11, title: 'this is title', created_at: '2019-03-02 00:00:00' },
    ])
    articles1.map(article1 => expect(isPlainObject(article1)).toBeTruthy())


    // by deep partial
    const articles2 = mapper.toPlain([
      { id: 10, title: '', createdAt: '2019-03-01 00:00:00' },
      { id: 11, title: 'this is title', createdAt: '2019-03-02 00:00:00' },
    ])

    expect(articles2).toEqual([
      { id: 10, title: '', created_at: '2019-03-01 00:00:00' },
      { id: 11, title: 'this is title', created_at: '2019-03-02 00:00:00' },
    ])
    articles2.map(article2 => expect(isPlainObject(article2)).toBeTruthy())
  })

  it('test nullable and default', () => {
    // not null
    const nonnull1 = new Mapper({
      ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: false, transformers: [] },
      ],
    })
    expect(nonnull1.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(() => nonnull1.toEntity({})).toThrowError(new Error('column(id) is not nullable.'))


    // not null + default scalar
    const nonnull2 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: false, default: 10, transformers: [] },
      ] })
    expect(nonnull2.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(nonnull2.toEntity({})).toEqual({ id: 10 })

    // not null + default handler
    const nonnull3 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: false, default: () => 10, transformers: [] },
      ] })
    expect(nonnull3.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(nonnull3.toEntity({})).toEqual({ id: 10 })

    // not null + default null
    const nonnull4 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: false, default: null, transformers: [] },
      ] })
    expect(nonnull4.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(() => nonnull4.toEntity({})).toThrowError(new Error('column(id) is not nullable.'))

    // not null + default null generator
    const nonnull5 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: false, default: () => null, transformers: [] },
      ] })
    expect(nonnull5.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(() => nonnull5.toEntity({})).toThrowError(new Error('column(id) is not nullable.'))

    // not null + default undefined
    const nonnull6 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: false, default: undefined, transformers: [] },
      ] })
    expect(nonnull6.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(() => nonnull6.toEntity({})).toThrowError(new Error('column(id) is not nullable.'))

    // not null + default undefined generator
    const nonnull7 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: false, default: () => undefined, transformers: [] },
      ] })
    expect(nonnull7.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(() => nonnull7.toEntity({})).toThrowError(new Error('column(id) is not nullable.'))


    // null
    const nullable1 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: true, transformers: [] },
      ] })
    expect(nullable1.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(nullable1.toEntity({})).toEqual({ id: null })

    // null + default scalar
    const nullable2 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: true, default: 10, transformers: [] },
      ] })
    expect(nullable2.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(nullable2.toEntity({})).toEqual({ id: 10 })

    // null + default handler
    const nullable3 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: true, default: () => 10, transformers: [] },
      ] })
    expect(nullable3.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(nullable3.toEntity({})).toEqual({ id: 10 })

    // null + default null
    const nullable4 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: true, default: null, transformers: [] },
      ] })
    expect(nullable4.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(nullable4.toEntity({})).toEqual({ id: null })

    // null + default null handler
    const nullable5 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: true, default: () => null, transformers: [] },
      ] })
    expect(nullable5.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(nullable5.toEntity({})).toEqual({ id: null })

    // null + default null
    const nullable6 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: true, default: undefined, transformers: [] },
      ] })
    expect(nullable6.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(nullable6.toEntity({})).toEqual({ id: null })

    // null + default null handler
    const nullable7 = new Mapper({ ctor: Something,
      columns: [
        { property: 'id', sourceKey: 'id', nullable: true, default: () => undefined, transformers: [] },
      ] })
    expect(nullable7.toEntity({ id: 1 })).toEqual({ id: 1 })
    expect(nullable7.toEntity({})).toEqual({ id: null })
  })
})
