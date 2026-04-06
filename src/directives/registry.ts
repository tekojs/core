import type { TekoDirective } from '../types.js'

export class DirectiveRegistry {
  private directives = new Map<string, TekoDirective>()

  register(name: string, fn: TekoDirective) {
    this.directives.set(name, fn)
  }

  get(name: string): TekoDirective | undefined {
    return this.directives.get(name)
  }
}