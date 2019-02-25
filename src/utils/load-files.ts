
const glob = require("glob") // tslint:disable-line

export async function loadFiles(path: string|string[]): Promise<void> {
  const patterns: string[] = Array.isArray(path) ? path : [path]
  const groupOfFiles = await Promise.all(patterns.map((pattern) => new Promise<string[]>((resolve, reject) => {
    glob(pattern, (err: any, files: string[]) => {
      if (err) {
        return reject(err)
      }
      resolve(files)
    })
  })))
  groupOfFiles.map((files) => files.map(require))
}
