import { resolve, join } from 'node:path'
import type { TekoConfig } from '../types.js'

export class ViewResolver {
  constructor(private config: Required<TekoConfig>) {}

  resolveView(name: string): string {
    const normalized = name.endsWith(this.config.extension) ? name : `${name}${this.config.extension}`
    return resolve(this.config.root, this.config.views[0], normalized)
  }

  resolveComponent(name: string): string {
    const file = `${name.replaceAll('.', '/')}${this.config.extension}`
    return resolve(this.config.root, this.config.components[0], file)
  }

  resolveLayout(name: string): string {
    const file = `${name.replaceAll('.', '/')}${this.config.extension}`
    return resolve(this.config.root, this.config.views[0], 'layouts', file.replace(/^layouts\//, ''))
  }
}