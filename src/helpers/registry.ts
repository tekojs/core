import type { TekoHelper } from '../types.js'

export class HelperRegistry {
  private helpers = new Map<string, TekoHelper>()

  register(name: string, fn: TekoHelper) {
    this.helpers.set(name, fn)
  }

  get(name: string): TekoHelper | undefined {
    return this.helpers.get(name)
  }

  all(): Record<string, TekoHelper> {
    return Object.fromEntries(this.helpers.entries())
  }
}