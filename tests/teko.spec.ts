import test from 'node:test'
import assert from 'node:assert/strict'

import { createTeko } from '../src/teko.js'

test('createTeko should initialize', () => {
  const teko = createTeko()
  assert.ok(teko)
})

test('renderRaw should render template', async () => {
  const teko = createTeko()

  const html = await teko.renderRaw('Hello {{ name }}', {
    name: 'Jefte',
  })

  assert.equal(html.includes('Jefte'), true)
})

test('share should inject global data', async () => {
  const teko = createTeko()

  teko.share({ appName: 'Teko' })

  const html = await teko.renderRaw('{{ appName }}')

  assert.equal(html.includes('Teko'), true)
})
