import { ConstructType } from "../interfaces/common"
import { createGraphQLObjectTypeFactory } from "./create-graphql-object-type-factory"
import { GraphQLObjectTypeFactory } from "./graphql-object-type-factory"


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
