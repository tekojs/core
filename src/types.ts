export interface TekoConfig {
  root?: string
  views?: string[]
  components?: string[]
  cache?: boolean
  extension?: string
  globals?: Record<string, unknown>
}

export type TekoHelper = (...args: unknown[]) => unknown
export type TekoDirective = (...args: unknown[]) => unknown
export type RenderState = Record<string, unknown>