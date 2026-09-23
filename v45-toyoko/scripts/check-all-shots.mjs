import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const plan=JSON.parse(fs.readFileSync(path.join(root,'src/toyoko_scene_plan.json'),'utf8'));
const chapters=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
const shots=plan.scenes.flatMap(s=>s.shots.map(sh=>({...sh,chapterId:s.chapterId})));
if(plan.scenes.length!==60||shots.length!==160||new Set(shots.map(s=>s.shotId)).size!==160)
 throw Error('Exact 60-scene/160-cut JSON source required');
const bg=new Map(plan.assetRegistry.backgrounds.map(b=>[b.id,b]));
const props=new Set(plan.assetRegistry.props.map(x=>x.id));
const actors=new Set(plan.assetRegistry.characters.map(x=>x.id));
const modes=new Set([null,'DIALOGUE_STAGE','MOVE_THROUGH_SPACE','SOCIAL_GRAPH',
 'DEPENDENCY_GRAPH','CHOICE_PATH','CROWD_GRID','DUAL_COMPARE']);
const supportedActions=new Set(['walk','sit','idle','phone_use','reach','receive','head_tilt','stand',
 'talk','open_door','look_around','look_up','shift_seat','stop','listen','step_back','point',
 'wake_up','look_down','withdraw_hand','close_door','turn','look_left','look_right','wave','smile',
 'search_bag','clasp_hands','search_wallet','connect_charger','pack_bag']);
const errors=[];
for(const s of shots){
 const background=bg.get(s.background);
 if(background?.status!=='existing')errors.push(s.shotId+' bg status '+s.background);
 const file=background?.assetFile||('shared/asset-library/'+(background?.sourceOrBrief??''));
 if(!/^shared\/asset-library\/背景\/[\w.-]+\.png$/.test(file))errors.push(s.shotId+' unresolved bg '+s.background);
 else if(!fs.existsSync(path.join(root,'public/assets/library/背景',path.basename(file))))
  errors.push(s.shotId+' unstaged bg '+file);
 for(const a of s.characters)if(!actors.has(a))errors.push(s.shotId+' unknown actor '+a);
 for(const p of s.props)if(!props.has(p))errors.push(s.shotId+' unknown prop '+p);
 for(const a of s.requiredRigActions)if(!supportedActions.has(a))errors.push(s.shotId+' unimplemented rig action '+a);
 if(!modes.has(s.template))errors.push(s.shotId+' unimplemented template '+s.template);
 if(!s.visual?.trim()||!s.acceptance?.proof?.trim())errors.push(s.shotId+' missing visual QA condition');
 if((s.weatherEffect?.type==='rain')!== (s.background==='BG_VANCOUVER_RAIN'))
  errors.push(s.shotId+' rainy scene backdrop/effect mismatch');
}
for(const chapter of chapters){
 const list=shots.filter(s=>s.chapterId===chapter);
 if(!list.length)errors.push('Missing storyboard chapter '+chapter);
}
if(errors.length)throw Error('Full storyboard implementation preflight: \n'+errors.join('\n'));
console.log('160/160 distinct shots, 60 scenes, six chapters, all backgrounds staged, all named actors, props, rig actions and visual templates recognized.');
console.log('This is source/static coverage validation; frame-by-frame aesthetic and handoff QA requires rendered video.');
