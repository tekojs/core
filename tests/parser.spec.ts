import test from 'node:test'
import assert from 'node:assert/strict'

import { parse } from '../src/internal/parser.js'

test('parse should handle simple expression', () => {
  const ast = parse('Hello {{ name }}')
  assert.ok(ast.length > 0)
})

test('parse should handle if block', () => {
  const ast = parse('@if(user)\n<p>ok</p>\n@end')

  const ifNode = ast.find((n: any) => n.type === 'If')
  assert.ok(ifNode)
  assert.equal(ifNode.condition, 'user')
})

test('parse should handle each block', () => {
  const ast = parse('@each(post in posts)\n{{ post }}\n@end')

  const eachNode = ast.find((n: any) => n.type === 'Each')
  assert.ok(eachNode)
  assert.equal(eachNode.item, 'post')
  assert.equal(eachNode.list, 'posts')
})

test('parse should handle component', () => {
  const ast = parse('@ui.button({})\nClick\n@end')

  const comp = ast.find((n: any) => n.type === 'Component')
  assert.ok(comp)
  assert.equal(comp.name, 'ui.button')
})
