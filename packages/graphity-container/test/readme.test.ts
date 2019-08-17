/* eslint-disable max-classes-per-file */

import * as di from '../lib'
import { endConsoleCapture, sleep, startConsoleCapture } from './utils'


describe('testsuite for README', () => {
  it('test to bind simple value', async () => {
    const container = di.create()

    startConsoleCapture()

    // section:bind-simple-value
    container.instance('obj1', { message: 'this is obj1' })
    container.instance('obj2', { message: 'this is obj2' })

    console.log(await container.get('obj1')) // { message: 'this is obj1' }
    console.log(await container.get('obj2')) // { message: 'this is obj2' }

    console.log(await container.get('obj1') === await container.get('obj1')) // true
    console.log(await container.get('obj2') === await container.get('obj2')) // true
    // endsection

    expect(endConsoleCapture()).toEqual([
      { message: 'this is obj1' },
      { message: 'this is obj2' },
      true,
      true,
    ])
  })

  it('test to bind promise value', async () => {
    const container = di.create()

    startConsoleCapture()

    // section:bind-promise-value
    function promise1() {
      return new Promise(resolve => resolve({ message: 'this is promise1' }))
    }
    async function promise2() {
      sleep(500)
      return { message: 'this is promise2' }
    }
    container.instance('promise1', promise1())
    container.instance('promise2', promise2())

    console.log(await container.get('promise1')) // { message: 'this is promise1' }
    console.log(await container.get('promise2')) // { message: 'this is promise2' }

    console.log(await container.get('promise1') === await container.get('promise1')) // true
    console.log(await container.get('promise2') === await container.get('promise2')) // true
    // endsection

    expect(endConsoleCapture()).toEqual([
      { message: 'this is promise1' },
      { message: 'this is promise2' },
      true,
      true,
    ])
  })

  it('test to bind factory', async () => {
    const container = di.create()

    startConsoleCapture()
    // section:bind-factory
    container.factory('factory1', () => ({ message: 'this is factory' }))
    container.factory('factory2', () => {
      return new Promise(resolve => {
        resolve({ message: 'this is promise factory' })
      })
    })
    container.factory('factory3', async () => {
      sleep(500)
      return { message: 'this is async factory' }
    })

    console.log(await container.get('factory1')) // { message: 'this is factory' }
    console.log(await container.get('factory2')) // { message: 'this is promise factory' }
    console.log(await container.get('factory3')) // { message: 'this is async factory' }
    // endsection

    expect(endConsoleCapture()).toEqual([
      { message: 'this is factory' },
      { message: 'this is promise factory' },
      { message: 'this is async factory' },
    ])
  })

  it('test to bind class', async () => {
    expect.assertions(2)

    const container = di.create()

    startConsoleCapture()

    // section:bind-class
    class Driver {
    }

    class Connection {
      public constructor(@di.Inject('driver') public driver: Driver) {
      }
    }
    container.bind('driver', Driver)
    container.bind('connection', Connection)

    const connection = await container.get<Connection>('connection')
    console.log(connection) // Connection { driver: Driver {} }
    console.log(connection.driver) // Driver {}
    // endsection

    endConsoleCapture()

    expect(connection).toBeInstanceOf(Connection)
    expect(connection.driver).toBeInstanceOf(Driver)
  })

  it('test singleton descriptor', async () => {
    const container = di.create()

    class Foo {
    }

    startConsoleCapture()

    // section:singleton-descriptor
    container.factory('factory.normal', () => ({ message: 'this is factory' }))
    container.factory('factory.singleton', () => ({ message: 'this is factory with singleton' })).singleton()

    container.bind('class.normal', Foo)
    container.bind('class.singleton', Foo).singleton()

    // not same
    console.log(await container.get('factory.normal') === await container.get('factory.normal')) // false
    console.log(await container.get('class.normal') === await container.get('class.normal')) // false

    // always same
    console.log(await container.get('factory.singleton') === await container.get('factory.singleton')) // true
    console.log(await container.get('class.singleton') === await container.get('class.singleton')) // true
    // endsection

    expect(endConsoleCapture()).toEqual([
      false,
      false,
      true,
      true,
    ])
  })

  it('test after descriptor', async () => {
    const container = di.create()

    startConsoleCapture()

    // section:after-descriptor

    container
      .factory('foo', () => ({ message: 'this is origin maessage.' }))
      .after(async (context) => {
        await sleep(300)
        context.message = `${context.message} and something appended.`
        return context
      })

    console.log(await container.get('foo')) // { message: 'this is origin maessage. and something appended.' }

    // endsection

    expect(endConsoleCapture()).toEqual([
      { message: 'this is origin maessage. and something appended.' },
    ])
  })

  it('test create method', async () => {
    const container = di.create()

    startConsoleCapture()

    // section:create-method
    class Connection {
    }

    class Controller {
      public constructor(@di.Inject('connection') public connection: Connection) {
      }
    }

    container.bind('connection', Connection)

    const controller = await container.create(Controller)

    console.log(controller) // Controller { connection: Connection {} }
    // endsection

    const result = endConsoleCapture()
    expect(result[0]).toBeInstanceOf(Controller)
    expect(result[0].connection).toBeInstanceOf(Connection)
  })

  it('test invoke method', async () => {
    const container = di.create()

    startConsoleCapture()

    // section:invoke-method
    class Connection {
    }

    class Controller {
      public retrieve(@di.Inject('connection') connection: Connection) {
        return connection
      }
    }

    container.bind('connection', Connection)

    const controller = new Controller()

    console.log(await container.invoke(controller, 'retrieve')) // Connection { }
    // endsection

    const result = endConsoleCapture()
    expect(result[0]).toBeInstanceOf(Connection)
  })

  it('test setToGlobal', () => {
    const originContainer = di.Container.instance

    expect(di.Container.instance).toBeInstanceOf(di.Container)
    expect(di.Container.instance).toBe(di.Container.instance)

    const container = new di.Container().setToGlobal()
    expect(container).toBeInstanceOf(di.Container)
    expect(container).toBe(di.Container.instance)

    expect(container).not.toBe(originContainer)
  })
})
