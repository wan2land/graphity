import { Name } from './common'

export type InjectDecoratorFactory = <T>(name: Name<T>, resolver?: (instance: T) => any) => ParameterDecorator
