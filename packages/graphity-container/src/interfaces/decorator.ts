import { Name } from './common'

export type InjectDecoratorFactory = (name: Name<any>) => ParameterDecorator
