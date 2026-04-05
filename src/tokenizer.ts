export type Token =
  | { type: 'text'; value: string }
  | { type: 'expr'; value: string; escaped: boolean }
  | { type: 'directive'; value: string };

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    if (input.startsWith('{{{', i)) {
      const end = input.indexOf('}}}', i);
      if (end === -1) throw new Error('Expressão raw não fechada');
      const value = input.slice(i + 3, end).trim();
      tokens.push({ type: 'expr', value, escaped: false });
      i = end + 3;
      continue;
    }

    if (input.startsWith('{{', i)) {
      const end = input.indexOf('}}', i);
      if (end === -1) throw new Error('Expressão não fechada');
      const value = input.slice(i + 2, end).trim();
      tokens.push({ type: 'expr', value, escaped: true });
      i = end + 2;
      continue;
    }

    if (input.startsWith('@', i)) {
      const nextLine = input.indexOf('\n', i);
      const end = nextLine === -1 ? input.length : nextLine;
      const maybeDirective = input.slice(i, end).trim();

      if (
        maybeDirective.startsWith('@if') ||
        maybeDirective.startsWith('@else') ||
        maybeDirective.startsWith('@end') ||
        maybeDirective.startsWith('@each') ||
        maybeDirective.startsWith('@slot') ||
        /^@[a-zA-Z0-9._]+\(/.test(maybeDirective)
      ) {
        tokens.push({ type: 'directive', value: maybeDirective });
        i = end;
        continue;
      }
    }

    let next = input.length;
    const exprIndex = input.indexOf('{{', i);
    const dirIndex = input.indexOf('@', i);

    if (exprIndex !== -1) next = Math.min(next, exprIndex);
    if (dirIndex !== -1) next = Math.min(next, dirIndex);

    const value = input.slice(i, next);
    tokens.push({ type: 'text', value });
    i = next;
  }

  return tokens.filter((t) => !(t.type === 'text' && t.value.length === 0));
}
