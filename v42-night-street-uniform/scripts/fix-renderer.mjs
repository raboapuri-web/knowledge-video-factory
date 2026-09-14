import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'src/index.tsx');
let s=fs.readFileSync(file,'utf8');
s=s.replace("fontWeight:900,color={p.c}","fontWeight:900,color:p.c");
fs.writeFileSync(file,s);
console.log('V42 renderer hotfix applied');
