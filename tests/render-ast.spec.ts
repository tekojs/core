import test from 'node:test'
import assert from 'node:assert/strict'

import { parse } from '../src/internal/parser.js'
import { renderAst } from '../src/internal/compiler.js'

test('renderAst should render expression', async () => {
  const ast = parse('Hello {{ name }}')
  const html = await renderAst(ast, { name: 'Jefte' }, {} as any)

  assert.equal(html.includes('Jefte'), true)
})

test('renderAst should handle if true', async () => {
  const ast = parse('@if(user)\nOK\n@end')
  const html = await renderAst(ast, { user: true }, {} as any)

  assert.equal(html.includes('OK'), true)
})

test('renderAst should handle each loop', async () => {
  const ast = parse('@each(item in items)\n{{ item }}\n@end')
  const html = await renderAst(ast, { items: ['A', 'B'] }, {} as any)

  assert.equal(html.includes('A'), true)
  assert.equal(html.includes('B'), true)
})
