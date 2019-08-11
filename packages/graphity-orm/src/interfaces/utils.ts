
export type Factory<T> = ((type: any) => T)

export type ConstructType<T> = (new (...args: any[]) => T) | Function

export type MaybeArray<T> = T | T[]

export type MaybeFactory<T> = T | Factory<T>
