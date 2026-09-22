import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {stageBackground} from './stage-background.mjs';

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'character-background-'));
const hash=(b)=>createHash('sha256').update(b).digest('hex');
try {
  const result=stageBackground(tmp,'BG_office.png');
  const staged=path.join(tmp,'public',result.publicPath);
  assert(fs.existsSync(staged),'background must be staged to public/ for Remotion staticFile');
  assert.equal(hash(fs.readFileSync(staged)),result.sha256);
  assert.equal(result.publicPath,'assets/library/背景/BG_office.png');
  assert.throws(()=>stageBackground(tmp,'../BG_office.png'),/single registered background filename/);
  assert.throws(()=>stageBackground(tmp,'BG_missing.png'),/not registered/);
  assert.throws(()=>stageBackground(tmp,'BG_office.png/../../fake.png'),/single registered background filename/);
  console.log('Background + articulated character staging: approved registry, checksum, paths PASS');
}finally {
  fs.rmSync(tmp,{recursive:true,force:true});
}
