import { GraphQLFieldConfigMap, GraphQLObjectType } from "graphql"
import { GraphQLFieldConfigFactoryMap } from "../interfaces/graphql"


export class ObjectTypeFactory {

  public objectType?: GraphQLObjectType

  public constructor(
    public name: string,
    public description?: string | null,
    public fields: GraphQLFieldConfigFactoryMap = {}
  ) {}

  public factory() {
    if (!this.objectType) {
      return this.objectType = new GraphQLObjectType({
        name: this.name,
        description: this.description,
        fields: () => Object.keys(this.fields).reduce((carry, field) => {
          return Object.assign<GraphQLFieldConfigMap<any, any>, GraphQLFieldConfigMap<any, any>>(carry, {
            [field]: this.fields[field](),
          })
        }, {}),
      })
    }
    return this.objectType
  }
}
