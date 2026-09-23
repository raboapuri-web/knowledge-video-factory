import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const folder=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(folder,'..');
const data=JSON.parse(fs.readFileSync(path.join(folder,'catalog.json'),'utf8'));
const imageCatalog=JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8'));
assert.equal(data.version,1);
assert(Array.isArray(data.characters)&&data.characters.length>0,'At least one React character must be registered');
const allowedLicense=new Set(['original-project','cleared-commercial','pending-review']);
const names=new Set(),files=new Set(),actionIds=new Set(['idle','walk','wave','point','sit','standUp','sitPhone','walkPhone']);
for(const character of data.characters){
  assert.match(character.id,/^[a-z][a-z0-9-]+$/);
  assert(!names.has(character.id),'Duplicate character ID: '+character.id);
  names.add(character.id);
  assert.equal(character.category,'人物テンプレート');
  assert.equal(character.type,'react-svg-rig');
  assert(allowedLicense.has(character.license));
  assert(['approved','pending-review'].includes(character.status));
  assert(Array.isArray(character.tags)&&character.tags.length>=3);
  assert(Array.isArray(character.actions)&&character.actions.length>0);
  assert(Array.isArray(character.adjustableJoints)&&character.adjustableJoints.length>=8);
  assert(Array.isArray(character.recommendedBackgrounds));
  assert.match(character.file,/^[a-z][a-z0-9-]*\.tsx$/);
  assert(!files.has(character.file),'Duplicate character file: '+character.file);
  files.add(character.file);
  assert.match(character.component,/^[A-Z][A-Za-z0-9]*$/);
  const code=fs.readFileSync(path.join(folder,character.file),'utf8');
  assert(code.includes('export const '+character.component+'='),'Exported React character missing: '+character.component);
  for(const action of character.actions){
    assert(actionIds.has(action.id),'Unknown action: '+action.id);
    assert(code.includes("'"+action.id+"'"),'Action not found in component code: '+action.id);
  }
  for(const joint of character.adjustableJoints)assert(code.includes(joint),'Joint not found in component code: '+joint);
  assert.equal(character.dimensions.width,360);
  assert.equal(character.dimensions.height,640);
  assert.match(character.sceneFile,/^[a-z][a-z0-9-]*\.tsx$/);
  const scene=fs.readFileSync(path.join(folder,character.sceneFile),'utf8');
  assert(scene.includes('export const '+character.sceneComponent+'='));
  for(const file of character.recommendedBackgrounds){
    const bg=imageCatalog.assets.find(a=>a.category==='背景'&&a.file===file);
    assert(bg,'Recommended background missing from asset master: '+file);
    assert(bg.license!=='pending-review','Background still pending review: '+file);
    assert(fs.existsSync(path.join(root,file)),'Background file missing: '+file);
  }
}
console.log('Character registry OK: '+data.characters.length+' registered React character(s), verified actions, joints and approved background references');
