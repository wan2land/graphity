# Graphity - Container

<a href="https://npmcharts.com/compare/@graphity/container?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/@graphity/container.svg?style=flat-square" /></a>
<a href="https://www.npmjs.com/package/@graphity/container"><img alt="Version" src="https://img.shields.io/npm/v/@graphity/container.svg?style=flat-square" /></a>
<a href="https://david-dm.org/wan2land/@graphity/container"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/@graphity/container.svg?style=flat-square" /></a>
<a href="https://david-dm.org/wan2land/@graphity/container?type=dev"><img alt="devDependencies Status" src="https://img.shields.io/david/dev/wan2land/@graphity/container.svg?style=flat-square" /></a>
<br />
<img alt="License" src="https://img.shields.io/npm/l/@graphity/container.svg?style=flat-square" />
<img alt="Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />

Super slim DI(Depdency Injection) container with Async/Promise for Javascript(& Typescript).

## Installation

```bash
npm install @graphity/container --save
```

## Usage

```javascript
const { SharedContainer } = require("@graphity/container")
// or import { SharedContainer } from "@graphity/container"

const container = new SharedContainer()
```


### Bind simple value

```ts
container.instance("obj1", {message: "this is obj1"})
container.instance("obj2", {message: "this is obj2"})

await container.boot() // boot!

console.log(container.get("obj1")) // {message: "this is obj1"}
console.log(container.get("obj2")) // {message: "this is obj2"}

console.log(container.get("obj1") === container.get("obj1")) // true
console.log(container.get("obj2") === container.get("obj2")) // true
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

await container.boot() // boot!

console.log(container.get("promise1")) // {message: "this is promise1"}
console.log(container.get("promise2")) // {message: "this is promise2"}

console.log(container.get("promise1") === container.get("promise1")) // true
console.log(container.get("promise2") === container.get("promise2")) // true
```

### Bind resolver

```ts
container.resolver("resolver1", () => ({message: "this is resolver"}))
container.resolver("resolver2", () => {
  return new Promise(resolve => {
    resolve({message: "this is promise resolver"})
  })
})
container.resolver("resolver3", async () => {
  sleep(500)
  return {message: "this is async resolver"}
})

await container.boot() // boot!

console.log(container.get("resolver1")) // {message: "this is resolver"}
console.log(container.get("resolver2")) // {message: "this is promise resolver"}
console.log(container.get("resolver3")) // {message: "this is async resolver"}
```

### Bind class

```ts
import { Inject } from "@graphity/container"

class Driver {
}

class Connection {
  public constructor(@Inject("driver") public driver: Driver) {
  }
}
container.bind("driver", Driver)
container.bind("connection", Connection)

await container.boot() // boot!

const connection = container.get<Connection>("connection")

console.log(connection) // Connection { driver: Driver {} }
console.log(connection.driver) // Driver {}
```

### create

```ts
import { Inject } from "@graphity/container"

class Connection {
}

class Controller {
  public constructor(@Inject("connection") public connection: Connection) {
  }
}

container.bind("connection", Connection)

await container.boot()

const controller = await container.create(Controller)

console.log(controller) // Controller { connection: Connection {} }
```

### invoke

```ts
import { Inject } from "@graphity/container"

class Connection {
}

class Controller {
  public retrieve(@Inject("connection") connection: Connection) {
    return connection
  }
}

container.bind("connection", Connection)

const controller = new Controller()

await container.boot()

console.log(await container.invoke(controller, "retrieve")) // Connection { }
```

### Service Provider

`providers/typeorm.ts`

```ts
import { Provider } from '@graphity/container'
import { Connection, createConnection } from 'typeorm'

export const typeorm: Provider = {
  register(app) {
    const DB_HOST = process.env.DB_HOST || 'localhost'
    const DB_DATABASE = process.env.DB_DATABASE || 'test'
    const DB_USERNAME = process.env.DB_USERNAME || 'root'
    const DB_PASSWORD = process.env.DB_PASSWORD || 'root'
    app.resolver(Connection, () => {
      return createConnection({
        type: 'mysql',
        host: DB_HOST,
        database: DB_DATABASE,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        /* ... */
      })
    })
  },
  async close(app) {
    const connection = await app.get(Connection)
    await connection.close()
  },
}
```

`controllers/user-controller.ts`

```ts
import { Inject } from "@graphity/container"
import { Connection, Repository } from 'typeorm'
import { User } from '../entities/user.ts'

export class UserController {
  public constructor(
    @Inject(Connection) public connection: Connection,
    @Inject(Connection, conn => conn.getRepository(User)) public repoUsers: Repository<User>,
  ) {
  }

  public users() {
    return this.repoUsers.find()
  }

  /* ... */
}
```

`entry.ts`

```ts
import { SharedContainer } from "@graphity/container"
import { typeorm } from './providers/typeorm'
import { UserController } from './controllers/user-controller'

const app = new SharedContainer()
app.register(typeorm)

await app.boot()

const userController = await app.create(UserController)
await userController.users() // call controller!

```

## License

MIT
