import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
const data = readdirSync(join(__dirname, '.'))
  .filter((f) => f.search('.adapter.ts') > 0)
  .map((e) => `export * from './${e.split('.ts')[0]}'`)
  .join('\n');
writeFileSync('index.ts', data, { encoding: 'utf8' });
