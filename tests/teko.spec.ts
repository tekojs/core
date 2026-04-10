import { createTeko } from '../src/teko.js'
import { test } from '@t8ngs/runner'

test.group('Teko', () => {
  test('createTeko should initialize', ({ assert }) => {
    const teko = createTeko()
    assert.ok(teko)
  })

  test('renderRaw should render template', async ({ assert }) => {
    const teko = createTeko()

    const html = await teko.renderRaw('Hello {{ name }}', {
      name: 'Jefte',
    })

    assert.equal(html.includes('Jefte'), true)
  })

  test('share should inject global data', async ({ assert }) => {
    const teko = createTeko()

    teko.share({ appName: 'Teko' })

    const html = await teko.renderRaw('{{ appName }}')

    assert.equal(html.includes('Teko'), true)
  })
})