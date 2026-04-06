import { resolveConfig } from './config.js'
import { FileLoader } from './loader/file_loader.js'
import { ViewResolver } from './loader/view_resolver.js'
import { ComponentRegistry } from './loader/component_registry.js'
import { HelperRegistry } from './helpers/registry.js'
import { DirectiveRegistry } from './directives/registry.js'
import { TekoRenderer } from './renderer/renderer.js'
import type { TekoConfig, TekoHelper, TekoDirective, RenderState } from './types.js'

export class Teko {
  private config
  private loader
  private views
  private components
  private helpers
  private directives
  private renderer
  private sharedState: RenderState = {}

  constructor(config: TekoConfig = {}) {
    this.config = resolveConfig(config)
    this.loader = new FileLoader(this.config)
    this.views = new ViewResolver(this.config)
    this.components = new ComponentRegistry()
    this.helpers = new HelperRegistry()
    this.directives = new DirectiveRegistry()
    this.renderer = new TekoRenderer({
      config: this.config,
      loader: this.loader,
      views: this.views,
      components: this.components,
      helpers: this.helpers,
      directives: this.directives,
    })
  }

  mount(dir: string): this {
    this.config.views.push(dir)
    return this
  }

  registerComponent(name: string, path: string): this {
    this.components.register(name, path)
    return this
  }

  registerHelper(name: string, fn: TekoHelper): this {
    this.helpers.register(name, fn)
    return this
  }

  registerDirective(name: string, fn: TekoDirective): this {
    this.directives.register(name, fn)
    return this
  }

  share(data: RenderState): this {
    this.sharedState = { ...this.sharedState, ...data }
    return this
  }

  async render(name: string, state: RenderState = {}) {
    return this.renderer.render(name, { ...this.sharedState, ...state })
  }

  async renderFile(path: string, state: RenderState = {}) {
    return this.renderer.renderFile(path, { ...this.sharedState, ...state })
  }

  async renderRaw(source: string, state: RenderState = {}) {
    return this.renderer.renderRaw(source, { ...this.sharedState, ...state })
  }

  clearCache(): void {
    this.loader.clearCache()
    this.renderer.clearCache()
  }
}

export function createTeko(config: TekoConfig = {}) {
  return new Teko(config)
}