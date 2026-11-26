import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

test('index uses a classic local script that needs no module loader', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  assert.match(html, /<script\s+defer\s+src="\.\/standalone\.js"><\/script>/);
  assert.doesNotMatch(html, /<script[^>]+type="module"/);
  const script = await readFile(resolve(root, 'standalone.js'), 'utf8');
  assert.doesNotMatch(script, /^\s*(?:import|export)\s/m);
  assert.match(script, /render\(\);/);
});
