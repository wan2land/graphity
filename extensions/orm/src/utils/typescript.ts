
// ref. https://www.typescriptlang.org/docs/handbook/mixins.html
export function applyMixins(base: any, mixins: any[]) {
  for (const mixin of mixins) {
    for (const property of Object.getOwnPropertyNames(mixin.prototype)) {
      Object.defineProperty(base.prototype, property, Object.getOwnPropertyDescriptor(mixin.prototype, property)!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }
  }
}
