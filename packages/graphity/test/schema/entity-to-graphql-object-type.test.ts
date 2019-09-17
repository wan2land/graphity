import { printType } from 'graphql'

import { entityToGraphQLObjectType } from '../../lib/schema/entity-to-graphql-object-type'
import { Article } from '../stubs/entities/article'


class UndefinedEntity {} // eslint-disable-line @typescript-eslint/no-extraneous-class

describe('testsuite of schema/create-object-type-factory', () => {
  it('test create type factory', async () => {
    const type = entityToGraphQLObjectType(Article)
    expect(printType(type)).toEqual(`"""article entity"""
type Article {
  """article id"""
  id: ID!
  title: String!
  contents: String
}`)
  })

  it('test undefined entity type factory', async () => {
    const schema = entityToGraphQLObjectType(UndefinedEntity)
    expect(printType(schema)).toEqual('type UndefinedEntity')
  })
})
