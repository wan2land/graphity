import { Column, ColumnType } from '../../lib'


export class Article {

  @Column({ type: ColumnType.Int })
  public id!: number

  @Column()
  public title!: string

  @Column({ nullable: true })
  public contents!: number

  @Column({ name: 'created_at' })
  public createdAt!: string
}
