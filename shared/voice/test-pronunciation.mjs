import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {applyPronunciationRules,loadPronunciationRules} from './apply-pronunciation.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const cases=JSON.parse(fs.readFileSync(path.join(here,'pronunciation-cases.json'),'utf8')).cases;
const rules=loadPronunciationRules();
let failed=0;
for(const c of cases){
  const actual=applyPronunciationRules(c.input,rules).text;
  if(actual!==c.expected){
    failed++;
    console.error(`FAIL: ${c.input} -> ${actual} / expected ${c.expected}`);
  }else{
    console.log(`PASS: ${c.input} -> ${actual}`);
  }
}
if(failed) process.exit(1);
console.log(`Pronunciation regression tests passed: ${cases.length}`);
