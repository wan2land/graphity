
export type ConstructType<T> = new (...args: any[]) => T

export type MaybeArray<T> = T | T[]

export type MaybePromise<T> = T | Promise<T>

export type Callable = (...args: any) => any
