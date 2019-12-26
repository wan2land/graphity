/* eslint-disable max-classes-per-file */
import { SharedContainer, Inject } from '../../lib'

class Mysql {
  public name = 'mysql'
}

class Postgres {
  public name = 'postgres'
}

class Mailer {
  public name = 'mailer'
}


class TestInjectController {
  public constructor(
    @Inject(Mysql) @Inject(Postgres) public connection: any,
    public queue: any,
    @Inject(Mailer) public mailer: any,
    @Inject(Mysql, (mysql) => mysql.name) public mysqlName: any,
    @Inject(Postgres, (postgres) => Promise.resolve(postgres.name)) public postgresName: any,
  ) {
  }

  public unknown(@Inject('unknown') unknown: any) {
    return unknown
  }
}


describe('testsuite of decorators/inject', () => {
  it('test inject', async () => {
    const container = new SharedContainer()

    const mysql = new Mysql()
    const postgres = new Postgres()
    const mailer = new Mailer()

    container.instance(Mysql, mysql)
    container.instance(Postgres, postgres)
    container.instance(Mailer, mailer)

    const result = await container.create(TestInjectController)

    expect(result.connection).toBe(mysql) // assign first only
    expect(result.queue).toBeUndefined() // undefined..!
    expect(result.mailer).toBe(mailer)
    expect(result.mysqlName).toBe('mysql')
    expect(result.postgresName).toBe('postgres')
  })
})
