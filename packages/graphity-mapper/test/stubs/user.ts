import { Column } from '../../lib'


export class User {

  @Column()
  public id?: number

  @Column()
  public username!: string

  @Column({ name: 'created_at' })
  public createdAt!: string
}
