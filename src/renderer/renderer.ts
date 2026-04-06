import { parse } from '../internal/parser.js'
import { renderAst } from '../internal/compiler.js'
import type { RenderState, TekoConfig } from '../types.js'
import { RenderCache } from './cache.js'

export interface TekoRendererDeps {
  config: Required<TekoConfig>
  loader: any
  views: any
  components: any
  helpers: any
  directives: any
}

export class TekoRenderer {
  private cache = new RenderCache<any>()

  constructor(private deps: TekoRendererDeps) {}

  async render(name: string, state: RenderState = {}) {
    const path = this.deps.views.resolveView(name)
    return this.renderFile(path, state)
  }

  async renderFile(path: string, state: RenderState = {}) {
    const source = await this.deps.loader.load(path)
    return this.renderRaw(source, state)
  }

  async renderRaw(source: string, state: RenderState = {}, incomingSlots: Record<string, string> = {}) {
    const ast = parse(source)

    return renderAst(ast, state, {
      resolveComponent: async (name: string) => {
        const explicit = this.deps.components.get(name)
        if (explicit) return this.deps.loader.load(explicit)

        if (name.startsWith('layouts.')) {
          return this.deps.loader.load(this.deps.views.resolveLayout(name))
        }

        return this.deps.loader.load(this.deps.views.resolveComponent(name))
      },
      renderTemplate: async (componentSource: string, componentState: RenderState, slots = {}) => {
        return this.renderRaw(componentSource, componentState, slots)
      },
    }, incomingSlots)
  }

  clearCache() {
    this.cache.clear()
  }
}