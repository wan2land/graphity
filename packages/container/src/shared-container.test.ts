/* eslint-disable max-classes-per-file, @typescript-eslint/no-extraneous-class */
import { Inject, SharedContainer } from '../lib'

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

describe('testsuite of container', () => {
  it('test instance', async () => {
    const container = new SharedContainer()

    container.instance('obj1', { message: 'this is obj1' })
    container.instance('obj2', { message: 'this is obj2' })

    await container.boot()

    const result1 = container.get('obj1')
    const result2 = container.get('obj2')

    expect(result1).toEqual({ message: 'this is obj1' })
    expect(result2).toEqual({ message: 'this is obj2' })

    expect(container.get('obj1')).toBe(result1)
    expect(container.get('obj2')).toBe(result2)
  })

  it('test promise instance', async () => {
    const container = new SharedContainer()

    function promise1() {
      return new Promise(resolve => resolve({ message: 'this is promise1' }))
    }
    async function promise2() {
      sleep(500)
      return { message: 'this is promise2' }
    }

    container.instance('promise1', promise1())
    container.instance('promise2', promise2())

    await container.boot()

    const result1 = container.get('promise1')
    const result2 = container.get('promise2')

    expect(result1).toEqual({ message: 'this is promise1' })
    expect(result2).toEqual({ message: 'this is promise2' })

    expect(container.get('promise1')).toBe(result1)
    expect(container.get('promise2')).toBe(result2)
  })

  it('test resolve', async () => {
    const container = new SharedContainer()

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

    await container.boot()

    expect(container.get('resolve1')).toEqual({ message: 'this is resolve' })
    expect(container.get('resolve2')).toEqual({ message: 'this is promise resolve' })
    expect(container.get('resolve3')).toEqual({ message: 'this is async resolve' })
  })

  it('test bind', async () => {
    expect.assertions(2)

    const container = new SharedContainer()

    class Driver {
    }

    class Connection {
      public constructor(@Inject('driver') public driver: Driver) {
      }
    }

    container.bind('driver', Driver)
    container.bind('connection', Connection)

    await container.boot()

    const connection = container.get<Connection>('connection')

    expect(connection).toBeInstanceOf(Connection)
    expect(connection.driver).toBeInstanceOf(Driver)
  })

  it('test create method', async () => {
    const container = new SharedContainer()

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
    const container = new SharedContainer()

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
    const originSharedContainer = SharedContainer.instance

    expect(SharedContainer.instance).toBeInstanceOf(SharedContainer)
    expect(SharedContainer.instance).toBe(SharedContainer.instance)

    const container = new SharedContainer().setToGlobal()
    expect(container).toBeInstanceOf(SharedContainer)
    expect(container).toBe(SharedContainer.instance)

    expect(container).not.toBe(originSharedContainer)
  })

  it('test boot lock', async () => {
    const container = new SharedContainer()

    let countOfCallRegister = 0
    let countOfCallBoot = 0

    container.register({
      async register() {
        countOfCallRegister++
        await new Promise(resolve => setTimeout(resolve, 500))
      },
      async boot() {
        countOfCallBoot++
        await new Promise(resolve => setTimeout(resolve, 500))
      },
    })

    await Promise.all([
      container.boot(),
      container.boot(),
      container.boot(),
    ])

    await container.boot()
    await container.boot()

    expect(countOfCallRegister).toBe(1)
    expect(countOfCallBoot).toBe(1)
  })

  it('test boot force', async () => {
    const container = new SharedContainer()

    let countOfCallRegister = 0
    let countOfCallBoot = 0

    container.register({
      async register() {
        countOfCallRegister++
        await new Promise(resolve => setTimeout(resolve, 500))
      },
      async boot() {
        countOfCallBoot++
        await new Promise(resolve => setTimeout(resolve, 500))
      },
    })

    await Promise.all([
      container.boot(),
      container.boot(),
      container.boot(),
    ])

    expect(countOfCallRegister).toBe(1)
    expect(countOfCallBoot).toBe(1)

    await container.boot(true)

    expect(countOfCallRegister).toBe(2)
    expect(countOfCallBoot).toBe(2)
  })

  it('test get singleton instance in same time', async () => {
    const container = new SharedContainer()

    container.resolver('instance', async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { name: 'instance' }
    })

    const [inst1, inst2] = await Promise.all([
      container.resolve('instance'),
      container.resolve('instance'),
    ])

    expect(inst1).toBe(inst2)
  })

  it('test get singleton instance in similar time', async () => {
    const container = new SharedContainer()

    container.resolver('instance', async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { name: 'instance' }
    })

    await container.boot()

    const [inst1, inst2] = await Promise.all([
      container.resolve('instance'),
      (async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return container.resolve('instance')
      })(),
    ])

    expect(inst1).toBe(inst2)
  })
})
