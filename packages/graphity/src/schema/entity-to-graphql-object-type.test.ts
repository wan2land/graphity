import { SharedContainer } from '@graphity/container'
import { printType } from 'graphql'

import { Article } from '../../stubs/entities/article'
import { entityToGraphQLObjectType } from './entity-to-graphql-object-type'


class UndefinedEntity {} // eslint-disable-line @typescript-eslint/no-extraneous-class

describe('testsuite of schema/create-object-type-factory', () => {
  it('test create type factory', async () => {
    const container = new SharedContainer()
    container.bind(Article, Article)

    const type = entityToGraphQLObjectType(container, Article)
    expect(printType(type)).toEqual(`"""article entity"""
type Article {
  """article id"""
  id: ID!
  title: String!
  contents: String
}`)
  })

  it('test undefined entity type factory', async () => {
    const container = new SharedContainer()

    const schema = entityToGraphQLObjectType(container, UndefinedEntity)
    expect(printType(schema)).toEqual('type UndefinedEntity')
  })
})
