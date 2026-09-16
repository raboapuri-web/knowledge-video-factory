import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const src=path.join(process.cwd(),'shared/bootstrap/v48-tokyo-envy.mjs');
let code=fs.readFileSync(src,'utf8');
code=code
  .replace("width:\\`${50-30*q}%\\`","width:(50-30*q)+'%'")
  .replace("width:\\`${50+30*q}%\\`","width:(50+30*q)+'%'");
const runtime=path.join(process.cwd(),'shared/bootstrap/.v48-tokyo-envy-runtime.mjs');
fs.writeFileSync(runtime,code);
await import(pathToFileURL(runtime).href+`?v=${Date.now()}`);
