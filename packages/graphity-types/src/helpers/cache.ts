
export function cache<TInput, TOutput>(handler: (input: TInput) => TOutput) {
  const storage = new Map<TInput, TOutput>()
  return (input: TInput): TOutput => {
    let type = storage.get(input)
    if (!type) {
      type = handler(input)
      storage.set(input, type)
    }
    return type
  }
}
