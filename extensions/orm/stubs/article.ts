import { Column, ColumnType, Entity, GeneratedColumn, Id } from '../src'

@Entity({ name: 'articles' })
export class Article {

  @Id() @GeneratedColumn({ type: ColumnType.Int })
  public id!: number

  @Column()
  public title!: string

  @Column({ nullable: true })
  public contents!: string | null

  @Column({ name: 'created_at' })
  public createdAt!: string
}
