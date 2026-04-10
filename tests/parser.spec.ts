import { parse } from '../src/internal/parser.js'
import { test } from '@t8ngs/runner'
import type { TekoNode } from '@tekojs/types'

test.group('Parser', () => {
  test('parse should handle simple expression', ({ assert }) => {
    const ast = parse('Hello {{ name }}')
    assert.ok(ast.body.length > 0)
  })

  test('parse should handle if block', ({ assert }) => {
    const ast = parse('@if(user)\n<p>ok</p>\n@end')

    const ifNode = ast.body.find((n: TekoNode) => n.type === 'If')
    assert.ok(ifNode)
    assert.equal(ifNode.test, 'user')
  })

  test('parse should handle each block', ({ assert }) => {
    const ast = parse('@each(post in posts)\n{{ post }}\n@end')

    const eachNode = ast.body.find((n: TekoNode) => n.type === 'Each')
    assert.ok(eachNode)
    assert.equal(eachNode.item, 'post')
    assert.equal(eachNode.iterable, 'posts')
  })

  test('parse should handle component', ({ assert }) => {
    const ast = parse('@ui.button({})\nClick\n@end')

    const comp = ast.body.find((n: TekoNode) => n.type === 'Component')
    assert.ok(comp)
    assert.equal(comp.name, 'ui.button')
  })
})