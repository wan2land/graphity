import { create, Inject } from '../../lib'

class TestController {
  public constructor(
    @Inject('mysql') @Inject('postgres') public connection: any,
    public queue: any,
    @Inject('mailer') public mailer: any
  ) {
  }

  public unknown(@Inject('unknown') unknown: any) {
    return unknown
  }
}


describe('testsuite of decorators/inject', () => {
  it('test inject', async () => {
    const container = create()

    container.instance('mysql', { _mock: 'mysql' })
    container.instance('postgres', { _mock: 'postgres' })
    container.instance('mailer', { _mock: 'mailer' })

    const result = await container.create(TestController)

    expect(result.connection).toEqual({ _mock: 'mysql' })
    expect(result.queue).toBeUndefined()
    expect(result.mailer).toEqual({ _mock: 'mailer' })
  })
})
