import { GraphQLFieldConfigMap, GraphQLObjectType } from "graphql"
import { GraphQLFieldConfigFactoryMap } from "../interfaces/graphql"


export class GraphQLObjectTypeFactory {

  public objectType?: GraphQLObjectType

  constructor(
    public name: string,
    public fields: GraphQLFieldConfigFactoryMap = {}
  ) {}

  public factory() {
    if (!this.objectType) {
      return this.objectType = new GraphQLObjectType({
        name: this.name,
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
