/* eslint-disable max-classes-per-file */

import { MetadataStorage } from '@graphity/schema'

import { findResolvers } from './findResolvers'


describe('graphity, utils/findResolvers', () => {
  it('test findResolvers', () => {

    class JustResolver1 {} // eslint-disable-line @typescript-eslint/no-extraneous-class
    class JustResolver2 {} // eslint-disable-line @typescript-eslint/no-extraneous-class
    class SingleResolver {} // eslint-disable-line @typescript-eslint/no-extraneous-class
    class SingleNothing {} // eslint-disable-line @typescript-eslint/no-extraneous-class
    class ArrayResolver {} // eslint-disable-line @typescript-eslint/no-extraneous-class
    class ArrayNothing {} // eslint-disable-line @typescript-eslint/no-extraneous-class
    class ObjectResolver {} // eslint-disable-line @typescript-eslint/no-extraneous-class
    class ObjectNothing {} // eslint-disable-line @typescript-eslint/no-extraneous-class

    jest.mock('./single-resolver', () => SingleResolver, { virtual: true })
    jest.mock('./single-nothing', () => SingleNothing, { virtual: true })
    jest.mock('./array', () => [ArrayResolver, ArrayNothing], { virtual: true })
    jest.mock('./object', () => ({ ObjectResolver, ObjectNothing }), { virtual: true })

    const storage = new MetadataStorage()
    storage.resolvers.set(JustResolver1, { target: JustResolver1, typeFactory: () => JustResolver1, middlewares: [] })
    storage.resolvers.set(JustResolver2, { target: JustResolver2, typeFactory: () => JustResolver2, middlewares: [] })
    storage.resolvers.set(SingleResolver, { target: SingleResolver, typeFactory: () => SingleResolver, middlewares: [] })
    storage.resolvers.set(ArrayResolver, { target: ArrayResolver, typeFactory: () => ArrayResolver, middlewares: [] })
    storage.resolvers.set(ObjectResolver, { target: ObjectResolver, typeFactory: () => ObjectResolver, middlewares: [] })

    const resolvers = findResolvers(storage, [
      JustResolver1,
      './single-resolver',
      './single-nothing',
      './array',
      './object',
      JustResolver2,
    ])

    expect(resolvers).toStrictEqual([
      JustResolver1,
      SingleResolver,
      ArrayResolver,
      ObjectResolver,
      JustResolver2,
    ])
  })
})
