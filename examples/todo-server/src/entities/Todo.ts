import { Field, GraphityEntity } from 'graphity'
import { GraphQLBoolean, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'


@GraphityEntity({
  description: 'Todo Entity',
})
@Entity({ name: 'todos' })
export class Todo {
  @Field(type => GraphQLNonNull(GraphQLID))
  @PrimaryGeneratedColumn()
  id!: string | number

  @Field(type => GraphQLNonNull(GraphQLString), {
    description: 'do what you want to do',
  })
  @Column({ type: String })
  title!: string

  @Field(type => GraphQLNonNull(GraphQLBoolean))
  @Column({ type: Boolean, default: false })
  completed!: boolean
}
