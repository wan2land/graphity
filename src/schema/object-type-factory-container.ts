import { createGraphQLObjectTypeFactory } from "../entity/create-graphql-object-type-factory"
import { GraphQLObjectTypeFactory } from "../entity/graphql-object-type-factory"
import { ConstructType } from "../interfaces/common"


export class ObjectTypeFactoryContainer {
  public entities = new Map<ConstructType<any>, GraphQLObjectTypeFactory>()

  public get(type: ConstructType<any>): GraphQLObjectTypeFactory {
    const result = this.entities.has(type) ?
      this.entities.get(type)! :
      (() => {
        const entity = createGraphQLObjectTypeFactory(type)
        this.entities.set(type, entity)
        return entity
      })()
    return result
  }
}
