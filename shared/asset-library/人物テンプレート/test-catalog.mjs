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
const names=new Set(),files=new Set(),actionIds=new Set(['idle','walk','wave','point','sit','standUp','sitPhone','walkPhone','photoFlash','inspectFlask']);
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
  assert.match(character.file,/^[A-Za-z][A-Za-z0-9_-]*\.tsx$/);
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
  if(character.id==='character-researcher-man'){
    assert(code.includes("action==='inspectFlask'"),'Researcher observation action missing');
    assert(code.includes('<Flask liquid={liquid}/>'),'Flask must be physically attached inside forearm hierarchy');
    assert(code.includes('<Hinge x={0} y={94} angle={elbow}>'),'Flask must follow elbow rotation');
    assert(!code.includes("photoFlash"),'Scientist rig should not reuse the passerby photo action');
    assert(character.recommendedBackgrounds.includes('背景/BG_kenkyu.png'));
  }
  if(character.id==='character-passerby-crowd'){
    assert.equal(character.dimensions.width,1920);
    assert.equal(character.dimensions.height,1080);
    assert.equal(character.groupSize,5);
    assert.equal(character.groupGenderCount.man,3);
    assert.equal(character.groupGenderCount.woman,2);
    assert.equal(character.facialFeatures,'none');
    assert.equal((code.match(/outfit:'(?:jacket|hoodie|cardigan|shirt)',x:/g)||[]).length,5);
    assert(code.includes("elapsed%45>=21&&elapsed%45<=23"),'Flash must be momentary, not always on');
    assert(code.includes("const photographer=action==='photoFlash'"),'Every person must take the photo');
    assert(!code.includes('photographerIndex'),'The outdated single photographer selector must not remain');
    assert(code.includes('a.leftShoulder=0;a.leftElbow=0'),'Free arm must hang straight down');
    assert(code.includes('a.rightShoulder=-75;a.rightElbow=-145'),'Phone arm must reverse bend in a V');
    assert(code.includes('phone={photographer} flash={flash}'),'Every phone must flash from its lens');
    assert(code.includes('<Hinge x={0} y={76} angle={elbow}>'),'Phone must follow elbow');
  }else{
    assert.equal(character.dimensions.width,360);
    assert.equal(character.dimensions.height,640);
  }
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
