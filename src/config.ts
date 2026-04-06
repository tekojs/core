import type { TekoConfig } from './types.js'

export function defineConfig(config: TekoConfig): TekoConfig {
  return config
}

export function resolveConfig(config: TekoConfig = {}): Required<TekoConfig> {
  return {
    root: config.root ?? process.cwd(),
    views: config.views ?? ['src/views'],
    components: config.components ?? ['src/views/components'],
    cache: config.cache ?? true,
    extension: config.extension ?? '.teko',
    globals: config.globals ?? {},
  }
}