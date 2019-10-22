import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql'

import { GraphQLResolver, Query } from '../../src'
import { Article } from '../entities/article'
import { User } from '../entities/user'

@GraphQLResolver(returns => User)
export class UserResolver {

  @Query({
    input: {
      id: { type: GraphQLNonNull(GraphQLID) },
    },
  })
  public user(parent: null, input: {id: string}) {
    return Object.assign(new User(), {
      id: `${input.id}`,
      name: `user${input.id}`,
    })
  }

  @Query({
    parent: () => Article,
    name: 'user',
  })
  public userFromArticle(parent: Article, input: {id: string}) {
    return Object.assign(new User(), {
      id: `${input.id}`,
      name: `user${input.id} of article${parent.id}`,
    })
  }

  @Query({
    parent: type => User,
    returns: node => GraphQLNonNull(new GraphQLObjectType({
      name: 'ListOfFriends',
      fields: {
        count: { type: GraphQLNonNull(GraphQLInt) },
        nodes: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(node))) },
      },
    })),
  })
  public friends(parent: User) {
    return {
      count: 2,
      nodes: [
        Object.assign(new User(), {
          id: `${parent.id}.1`,
          name: `friend1 of ${parent.name}`,
        }),
        Object.assign(new User(), {
          id: `${parent.id}.2`,
          name: `friend2 of ${parent.name}`,
        }),
      ],
    }
  }
}
