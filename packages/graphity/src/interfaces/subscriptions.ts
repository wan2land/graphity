
export interface Publishable {
  publish(eventName: string, payload: any): Promise<void>
}

export interface Subscribable {
  asyncIterator<T>(eventName: string | string[]): Promise<AsyncIterable<T>> | AsyncIterable<T>
}

export interface PubSub extends Publishable, Subscribable {
}
