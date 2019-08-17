/* eslint-disable max-classes-per-file */
import { Container, Inject } from '../lib'


class Foo {
  public constructor(@Inject('bar') public bar: Bar) {
  }
}

class Bar {
  public constructor(@Inject('foo') public foo: Foo) {
  }
}

describe('testsuite of Container', () => {
  it('test circular reference', async () => {
    const container = new Container()
    container.bind('foo', Foo)
    container.bind('bar', Bar)

    await container.boot()

    try {
      await container.get('foo')
      fail()
    } catch (e) {
      expect(e.code).toEqual('CIRCULAR_REFERENCE')
      expect(e.message).toEqual('circular reference found!')
      expect(e.stack).toEqual(['foo', 'bar'])
    }
    expect(container.stack).toEqual([])
  })
})
