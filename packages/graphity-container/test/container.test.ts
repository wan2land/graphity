/* eslint-disable max-classes-per-file, @typescript-eslint/no-extraneous-class */
import { Container, Inject } from '../lib'
import { sleep } from './utils'


describe('testsuite of container', () => {
  it('test instance', async () => {
    const container = new Container()

    container.instance('obj1', { message: 'this is obj1' })
    container.instance('obj2', { message: 'this is obj2' })

    const result1 = await container.get('obj1')
    const result2 = await container.get('obj2')

    expect(result1).toEqual({ message: 'this is obj1' })
    expect(result2).toEqual({ message: 'this is obj2' })

    await expect(container.get('obj1')).resolves.toBe(result1)
    await expect(container.get('obj2')).resolves.toBe(result2)
  })

  it('test promise instance', async () => {
    const container = new Container()

    function promise1() {
      return new Promise(resolve => resolve({ message: 'this is promise1' }))
    }
    async function promise2() {
      sleep(500)
      return { message: 'this is promise2' }
    }

    container.instance('promise1', promise1())
    container.instance('promise2', promise2())

    const result1 = await container.get('promise1')
    const result2 = await container.get('promise2')

    expect(result1).toEqual({ message: 'this is promise1' })
    expect(result2).toEqual({ message: 'this is promise2' })

    await expect(container.get('promise1')).resolves.toBe(result1)
    await expect(container.get('promise2')).resolves.toBe(result2)
  })

  it('test resolve', async () => {
    const container = new Container()

    container.resolver('resolve1', () => ({ message: 'this is resolve' }))
    container.resolver('resolve2', () => {
      return new Promise(resolve => {
        resolve({ message: 'this is promise resolve' })
      })
    })
    container.resolver('resolve3', async () => {
      sleep(500)
      return { message: 'this is async resolve' }
    })

    const result1 = await container.get('resolve1')
    const result2 = await container.get('resolve2')
    const result3 = await container.get('resolve3')

    expect(result1).toEqual({ message: 'this is resolve' })
    expect(result2).toEqual({ message: 'this is promise resolve' })
    expect(result3).toEqual({ message: 'this is async resolve' })
  })

  it('test bind', async () => {
    expect.assertions(2)

    const container = new Container()

    class Driver {
    }

    class Connection {
      public constructor(@Inject('driver') public driver: Driver) {
      }
    }

    container.bind('driver', Driver)
    container.bind('connection', Connection)

    const connection = await container.get<Connection>('connection')

    expect(connection).toBeInstanceOf(Connection)
    expect(connection.driver).toBeInstanceOf(Driver)
  })

  it('test create method', async () => {
    const container = new Container()

    class Connection {
    }

    class Controller {
      public constructor(@Inject('connection') public connection: Connection) {
      }
    }

    container.bind('connection', Connection)

    const controller = await container.create(Controller)

    expect(controller).toBeInstanceOf(Controller)
    expect(controller.connection).toBeInstanceOf(Connection)
  })

  it('test invoke method', async () => {
    const container = new Container()

    class Connection {
    }

    class Controller {
      public retrieve(@Inject('connection') connection: Connection) {
        return connection
      }
    }

    container.bind('connection', Connection)

    const controller = new Controller()

    await expect(container.invoke(controller, 'retrieve')).resolves.toBeInstanceOf(Connection)
  })

  it('test setToGlobal', () => {
    const originContainer = Container.instance

    expect(Container.instance).toBeInstanceOf(Container)
    expect(Container.instance).toBe(Container.instance)

    const container = new Container().setToGlobal()
    expect(container).toBeInstanceOf(Container)
    expect(container).toBe(Container.instance)

    expect(container).not.toBe(originContainer)
  })
})
