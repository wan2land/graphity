/* eslint-disable max-classes-per-file,@typescript-eslint/no-extraneous-class */
import { GraphQLString, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID } from 'graphql'

import { Field } from '../decorators/field'
import { GraphityEntity } from '../decorators/graphity-entity'
import { MetadataStorage } from '../metadata/storage'
import { toGraphQLObject } from './to-graphql-object'


describe('@graphity/decorator, schema/to-graphql-object', () => {

  it('test toGraphQLObject, undefined graphity entity', () => {
    const metadataStorage = new MetadataStorage()
    class User {
    }

    expect(toGraphQLObject(User, { metadataStorage })).toEqualGraphQLType('type User')
  })

  it('test toGraphQLObject, empty class', () => {
    const metadataStorage = new MetadataStorage()

    @GraphityEntity({ metadataStorage })
    class User {
    }

    expect(toGraphQLObject(User, { metadataStorage })).toEqualGraphQLType('type User')
  })

  it('test toGraphQLObject, full class', () => {
    const metadataStorage = new MetadataStorage()

    @GraphityEntity({ metadataStorage })
    class User {
      @Field(GraphQLID, {
        description: 'ID Type',
        metadataStorage,
      })
      id!: string

      @Field(_ => GraphQLString, { metadataStorage })
      username!: string

      @Field(_ => GraphQLString, {
        name: 'aliasLegacyName',
        deprecated: 'use other property',
        metadataStorage,
      })
      legacySomething!: string

      @Field(GraphQLNonNull(GraphQLList(GraphQLNonNull(new GraphQLObjectType({
        name: 'Social',
        fields: {
          type: { type: GraphQLNonNull(GraphQLString) },
        },
      })))), { metadataStorage })
      socials!: { type: string }[]

      @Field(() => GraphQLNonNull(GraphQLList(GraphQLNonNull(new GraphQLObjectType({
        name: 'Role',
        fields: {
          name: { type: GraphQLNonNull(GraphQLString) },
        },
      })))), { metadataStorage })
      roles!: { name: string }[]
    }

    expect(toGraphQLObject(User, { metadataStorage })).toEqualGraphQLType(`type User {
      """ID Type"""
      id: ID
      username: String
      aliasLegacyName: String @deprecated(reason: "use other property")
      socials: [Social!]!
      roles: [Role!]!
    }`)
  })

  it('test toGraphQLObject, with other class', () => {
    const metadataStorage = new MetadataStorage()

    @GraphityEntity({ metadataStorage })
    class User {
      @Field(GraphQLID, { metadataStorage })
      id!: string

      @Field(() => toGraphQLObject(Role), { metadataStorage })
      role!: Role

      @Field(() => toGraphQLObject(Role), { metadataStorage })
      otherRole!: Role
    }

    @GraphityEntity({ metadataStorage })
    class Role {
      @Field(GraphQLID, { metadataStorage })
      id!: string

      @Field(GraphQLString, { metadataStorage })
      name!: string

      @Field(() => User, { metadataStorage }) // also use class!
      user!: User

      @Field(() => User, { metadataStorage }) // also use class!
      firstUser!: User
    }

    expect(toGraphQLObject(User, { metadataStorage })).toEqualGraphQLType(`type User {
      id: ID
      role: Role
      otherRole: Role
    }`)

    expect(toGraphQLObject(Role, { metadataStorage })).toEqualGraphQLType(`type Role {
      id: ID
      name: String
      user: User
      firstUser: User
    }`)
  })
})
