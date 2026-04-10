import { renderAst } from '@tekojs/compiler'
import { parse } from '../src/internal/parser.js'
import { test } from '@t8ngs/runner'

test.group('renderAst', () => {
  test('renderAst should render expression', async ({ assert }) => {
    const ast = parse('Hello {{ name }}')
    const html = await renderAst(ast, { name: 'Jefte' }, {
      resolveComponent: async () => '',
      renderTemplate: async () => ''
    })

    assert.equal(html.includes('Jefte'), true)
  })

  test('renderAst should handle if true', async ({ assert }) => {
    const ast = parse('@if(user)\nOK\n@end')
    const html = await renderAst(ast, { user: true }, {
      resolveComponent: async () => '',
      renderTemplate: async () => ''
    })

    assert.equal(html.includes('OK'), true)
  })

  test('renderAst should handle each loop', async ({ assert }) => {
    const ast = parse('@each(item in items)\n{{ item }}\n@end')
    const html = await renderAst(ast, { items: ['A', 'B'] }, {
      resolveComponent: async () => '',
      renderTemplate: async () => ''
    })

    assert.equal(html.includes('A'), true)
    assert.equal(html.includes('B'), true)
  })
})