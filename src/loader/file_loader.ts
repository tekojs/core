import { readFile } from 'node:fs/promises'
import type { TekoConfig } from '../types.js'

export class FileLoader {
  private cache = new Map<string, string>()

  constructor(private config: Required<TekoConfig>) {}

  async load(path: string): Promise<string> {
    if (this.config.cache && this.cache.has(path)) {
      return this.cache.get(path)!
    }

    const source = await readFile(path, 'utf8')

    if (this.config.cache) {
      this.cache.set(path, source)
    }

    return source
  }

  clearCache() {
    this.cache.clear()
  }
}