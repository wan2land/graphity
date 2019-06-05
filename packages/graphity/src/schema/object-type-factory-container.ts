import { ConstructType } from "../interfaces/common"
import { createObjectTypeFactory } from "./create-object-type-factory"
import { ObjectTypeFactory } from "./object-type-factory"


export class ObjectTypeFactoryContainer {
  public entities = new Map<ConstructType<any>, ObjectTypeFactory>()

  public get(type: ConstructType<any>): ObjectTypeFactory {
    const result = this.entities.has(type) ?
      this.entities.get(type)! :
      (() => {
        const entity = createObjectTypeFactory(type)
        this.entities.set(type, entity)
        return entity
      })()
    return result
  }
}
