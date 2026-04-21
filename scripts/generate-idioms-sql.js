import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const idiomsPath = join(__dirname, '../src/data/idioms.ts');
const sqlPath = join(__dirname, '../supabase/migrations/002_seed_idioms.sql');

const content = readFileSync(idiomsPath, 'utf-8');

// Extract idiom data from the array
const regex = /\{ text: '([^']+)', pinyin: \[([^\]]+)\] \}/g;
const idioms = [];
let match;
while ((match = regex.exec(content)) !== null) {
  const text = match[1];
  const pinyinRaw = match[2];
  const pinyin = pinyinRaw
    .split(',')
    .map(s => s.trim().replace(/^'|'$/g, ''))
    .filter(s => s.length > 0);
  if (pinyin.length === 4) {
    idioms.push({ text, pinyin });
  }
}

const lines = idioms.map(
  i => `  ('${i.text}', ARRAY['${i.pinyin.join("', '")}'])`
);

const sql = `INSERT INTO idioms (text, pinyin) VALUES\n${lines.join(',\n')}\nON CONFLICT (text) DO NOTHING;\n`;

import { writeFileSync } from 'fs';
writeFileSync(sqlPath, sql, 'utf-8');
console.log(`Generated ${idioms.length} idiom INSERT statements -> ${sqlPath}`);
