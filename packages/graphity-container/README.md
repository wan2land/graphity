# STDJS - DI

[![Build](https://img.shields.io/travis/corgidisco/stdjs-di.svg)](https://travis-ci.org/corgidisco/stdjs-di)
[![Downloads](https://img.shields.io/npm/dt/@stdjs/di.svg)](https://npmcharts.com/compare/@stdjs/di?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/di.svg)](https://www.npmjs.com/package/@stdjs/di)
[![License](https://img.shields.io/npm/l/@stdjs/di.svg)](https://www.npmjs.com/package/@stdjs/di)

[![dependencies Status](https://img.shields.io/david/corgidisco/stdjs-di.svg)](https://david-dm.org/corgidisco/stdjs-di)
[![devDependencies Status](https://img.shields.io/david/dev/corgidisco/stdjs-di.svg)](https://david-dm.org/corgidisco/stdjs-di?type=dev)

[![NPM](https://nodei.co/npm/@stdjs/di.png)](https://www.npmjs.com/package/@stdjs/di)

Super slim DI(Depdency Injection) container with Async/Promise for Javascript(& Typescript).

## Installation

```bash
npm install @stdjs/di --save
```

## Usage

```javascript
const di = require("@stdjs/di")
// or import * as di from "@stdjs/di"

const container = di.create()
// or const container = new di.Container()
```

### Bind simple value

```ts
container.instance("obj1", {message: "this is obj1"})
container.instance("obj2", {message: "this is obj2"})

console.log(await container.get("obj1")) // {message: "this is obj1"}
console.log(await container.get("obj2")) // {message: "this is obj2"}

console.log(await container.get("obj1") === await container.get("obj1")) // true
console.log(await container.get("obj2") === await container.get("obj2")) // true
```

### Bind promise value

```ts
function promise1() {
  return new Promise(resolve => resolve({message: "this is promise1"}))
}
async function promise2() {
  sleep(500)
  return {message: "this is promise2"}
}
container.instance("promise1", promise1())
container.instance("promise2", promise2())

console.log(await container.get("promise1")) // {message: "this is promise1"}
console.log(await container.get("promise2")) // {message: "this is promise2"}

console.log(await container.get("promise1") === await container.get("promise1")) // true
console.log(await container.get("promise2") === await container.get("promise2")) // true
```

### Bind factory

```ts
container.factory("factory1", () => ({message: "this is factory"}))
container.factory("factory2", () => {
  return new Promise(resolve => {
    resolve({message: "this is promise factory"})
  })
})
container.factory("factory3", async () => {
  sleep(500)
  return {message: "this is async factory"}
})

console.log(await container.get("factory1")) // {message: "this is factory"}
console.log(await container.get("factory2")) // {message: "this is promise factory"}
console.log(await container.get("factory3")) // {message: "this is async factory"}
```

### Bind class

```ts
class Driver {
}

class Connection {
  public constructor(@di.Inject("driver") public driver: Driver) {
  }
}
container.bind("driver", Driver)
container.bind("connection", Connection)

const connection = await container.get<Connection>("connection")
console.log(connection) // Connection { driver: Driver {} }
console.log(connection.driver) // Driver {}
```

### Singleton descriptor

Descriptor is very useful if you using factory or bind. this is example of singleton.

```ts
container.factory("factory.normal", () => ({message: "this is factory"}))
container.factory("factory.singleton", () => ({message: "this is factory with singleton"})).singleton()

container.bind("class.normal", Foo)
container.bind("class.singleton", Foo).singleton()

// not same
console.log(await container.get("factory.normal") === await container.get("factory.normal")) // false
console.log(await container.get("class.normal") === await container.get("class.normal")) // false

// always same
console.log(await container.get("factory.singleton") === await container.get("factory.singleton")) // true
console.log(await container.get("class.singleton") === await container.get("class.singleton")) // true
```

### After descriptor

```ts

container
  .factory("foo", () => ({message: "this is origin maessage."}))
  .after(async (context) => {
    await sleep(300)
    context.message = context.message + " and something appended."
    return context
  })

console.log(await container.get("foo")) // {message: "this is origin maessage. and something appended."}
```

### create

```ts
class Connection {
}

class Controller {
  public constructor(@di.Inject("connection") public connection: Connection) {
  }
}

container.bind("connection", Connection)

const controller = await container.create(Controller)

console.log(controller) // Controller { connection: Connection {} }
```

### invoke

```ts
class Connection {
}

class Controller {
  public retrieve(@di.Inject("connection") connection: Connection) {
    return connection
  }
}

container.bind("connection", Connection)

const controller = new Controller()

console.log(await container.invoke(controller, "retrieve")) // Connection { }
```

## License

MIT
