/* eslint-disable max-classes-per-file, @typescript-eslint/no-extraneous-class */
import { Container } from '../lib'

class Foo {
}

describe('testsuite of descriptor', () => {
  it('test factory descriptor', async () => {
    const container = new Container()

    container.resolver('resolve.singleton', () => ({ message: 'this is singleton' }))
    container.resolver('resolve.factory', () => ({ message: 'this is factory' })).factory()

    container.bind('bind.singleton', Foo)
    container.bind('bind.factory', Foo).factory()

    const resultResolveFactory = await container.get('resolve.factory')
    const resultBindFactory = await container.get('bind.factory')

    await expect(container.get('resolve.factory')).resolves.not.toBe(resultResolveFactory)
    await expect(container.get('bind.factory')).resolves.not.toBe(resultBindFactory)

    const resultResolveSingleton = await container.get('resolve.singleton')
    const resultBindSingleton = await container.get('bind.singleton')

    await expect(container.get('resolve.singleton')).resolves.toBe(resultResolveSingleton)
    await expect(container.get('bind.singleton')).resolves.toBe(resultBindSingleton)
  })
})
