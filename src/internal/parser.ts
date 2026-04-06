import type {
  TemplateNode,
  TekoNode,
  IfNode,
  EachNode,
  ComponentNode,
  SlotNode,
} from '@tekojs/types';
import { tokenize, type Token } from '../tokenizer.js';

export function parse(source: string): TemplateNode {
  const tokens = tokenize(source);
  let index = 0;

  function peek(): Token | undefined {
    return tokens[index];
  }

  function next(): Token | undefined {
    return tokens[index++];
  }

  function parseBlock(stopDirectives: string[] = []): TekoNode[] {
    const body: TekoNode[] = [];

    while (index < tokens.length) {
      const token = peek();
      if (!token) break;

      if (token.type === 'directive') {
        const directiveName = token.value.split(/[ (]/)[0];
        if (stopDirectives.includes(directiveName)) break;

        if (directiveName === '@if') {
          body.push(parseIf());
          continue;
        }
        if (directiveName === '@each') {
          body.push(parseEach());
          continue;
        }
        if (directiveName === '@slot') {
          body.push(parseSlot());
          continue;
        }
        if (/^@[a-zA-Z0-9._]+\(/.test(token.value)) {
          body.push(parseComponent());
          continue;
        }
        if (directiveName === '@else' || directiveName === '@end') break;
      }

      next();

      if (token.type === 'text') {
        body.push({ type: 'Text', value: token.value });
      } else if (token.type === 'expr') {
        body.push({ type: 'Expression', value: token.value, escaped: token.escaped });
      }
    }

    return body;
  }

  function parseIf(): IfNode {
    const token = next();
    if (!token || token.type !== 'directive') throw new Error('Esperado @if');
    const match = token.value.match(/^@if\((.*)\)$/);
    if (!match) throw new Error(`Diretiva inválida: ${token.value}`);

    const consequent = parseBlock(['@else', '@end']);
    let alternate: TekoNode[] = [];

    const maybeElse = peek();
    if (maybeElse?.type === 'directive' && maybeElse.value.startsWith('@else')) {
      next();
      alternate = parseBlock(['@end']);
    }

    const end = next();
    if (!end || end.type !== 'directive' || !end.value.startsWith('@end')) {
      throw new Error('@if sem @end');
    }

    return { type: 'If', test: match[1].trim(), consequent, alternate };
  }

  function parseEach(): EachNode {
    const token = next();
    if (!token || token.type !== 'directive') throw new Error('Esperado @each');
    const match = token.value.match(/^@each\(([a-zA-Z_$][a-zA-Z0-9_$]*)\s+in\s+(.*)\)$/);
    if (!match) throw new Error(`Diretiva inválida: ${token.value}`);

    const body = parseBlock(['@end']);
    const end = next();
    if (!end || end.type !== 'directive' || !end.value.startsWith('@end')) {
      throw new Error('@each sem @end');
    }

    return { type: 'Each', item: match[1], iterable: match[2].trim(), body };
  }

  function parseComponent(): ComponentNode {
    const token = next();
    if (!token || token.type !== 'directive') throw new Error('Esperado componente');
    const match = token.value.match(/^@([a-zA-Z0-9._]+)\((.*)\)$/);
    if (!match) throw new Error(`Componente inválido: ${token.value}`);

    const children = parseBlock(['@end']);
    const end = next();
    if (!end || end.type !== 'directive' || !end.value.startsWith('@end')) {
      throw new Error(`Componente ${match[1]} sem @end`);
    }

    return { type: 'Component', name: match[1], props: match[2].trim() || null, children };
  }

  function parseSlot(): SlotNode {
    const token = next();
    if (!token || token.type !== 'directive') throw new Error('Esperado @slot');
    const match = token.value.match(/^@slot\(['"](.+?)['"]\)$/);
    if (!match) throw new Error(`Slot inválido: ${token.value}`);

    const children = parseBlock(['@end']);
    const end = next();
    if (!end || end.type !== 'directive' || !end.value.startsWith('@end')) {
      throw new Error(`Slot ${match[1]} sem @end`);
    }

    return { type: 'Slot', name: match[1], children };
  }

  return { type: 'Template', body: parseBlock() };
}
