export class ComponentRegistry {
  private components = new Map<string, string>()

  register(name: string, path: string) {
    this.components.set(name, path)
  }

  get(name: string): string | undefined {
    return this.components.get(name)
  }
}