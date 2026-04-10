import { tokenize } from '../src/tokenizer.js'
import { test } from '@t8ngs/runner'

test.group('Tokenizer', () => {
  test('tokenize should parse escaped expression', ({ assert }) => {
    const tokens = tokenize('Hello {{ name }}')

    assert.equal(tokens.length, 2)
    assert.deepEqual(tokens[0], { type: 'text', value: 'Hello ' })
    assert.deepEqual(tokens[1], { type: 'expr', value: 'name', escaped: true })
  })

  test('tokenize should parse raw expression', ({ assert }) => {
    const tokens = tokenize('{{{ html }}}')

    assert.equal(tokens.length, 1)
    assert.deepEqual(tokens[0], { type: 'expr', value: 'html', escaped: false })
  })

  test('tokenize should parse if directive', ({ assert }) => {
    const tokens = tokenize('@if(user.loggedIn)\n<p>ok</p>\n@end')

    assert.equal(tokens[0]?.type, 'directive')
    assert.equal(tokens[0]?.value, '@if(user.loggedIn)')
    assert.equal(tokens[tokens.length - 1]?.type, 'directive')
    assert.equal(tokens[tokens.length - 1]?.value, '@end')
  })

  test('tokenize should parse each directive', ({ assert }) => {
    const tokens = tokenize('@each(post in posts)\n{{ post }}\n@end')

    assert.equal(tokens[0]?.type, 'directive')
    assert.equal(tokens[0]?.value, '@each(post in posts)')
  })

  test('tokenize should parse component directive', ({ assert }) => {
    const tokens = tokenize('@ui.button({ type: \'submit\' })\nSalvar\n@end')

    assert.equal(tokens[0]?.type, 'directive')
    assert.equal(tokens[0]?.value, '@ui.button({ type: \'submit\' })')
  })
})