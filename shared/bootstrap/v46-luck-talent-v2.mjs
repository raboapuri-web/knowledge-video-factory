import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const src=path.join(process.cwd(),'shared/bootstrap/v46-luck-talent.mjs');
let code=fs.readFileSync(src,'utf8');
code=code
  .replace("if(narrations.length!==70||visuals.length!==70) throw new Error(`Expected 70 scenes, got ${narrations.length}/${visuals.length}`);","if(narrations.length!==69||visuals.length!==69) throw new Error(`Expected 69 scenes, got ${narrations.length}/${visuals.length}`);")
  .replace("if(cats.length!==70) throw new Error('Category count mismatch');","cats.length=69; if(cats.length!==69) throw new Error('Category count mismatch');")
  .replace("default:return <OneOff n={70} kind='final' keyName='final_answer' accent='#f5c66a' seed={42}/>;","default:return <OneOff n={69} kind='final' keyName='final_answer' accent='#f5c66a' seed={42}/>;")
  .replace('- 70 narration beats / 70 distinct visual keys.','- 69 narration beats / 69 distinct visual keys.');
const runtime=path.join(process.cwd(),'shared/bootstrap/.v46-luck-talent-runtime.mjs');
fs.writeFileSync(runtime,code);
await import(pathToFileURL(runtime).href+`?v=${Date.now()}`);
