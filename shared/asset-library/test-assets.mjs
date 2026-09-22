import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildPlan,prepareEpisode,validateCatalog,rankAsset} from './prepare.mjs';
const original=validateCatalog();
const beats=[
 {id:'S001',bgGroup:'B001',phase:'data_center',narration:'データセンターのサーバーに情報が収集され、技術者はスマートフォンの画面を見てデータを分析する。',assetComposition:'library'},
 {id:'S002',bgGroup:'B001',phase:'data_center',narration:'サーバーの画面でデータを分析する。'},
 {id:'S003',bgGroup:'B002',phase:'data_center',narration:'別のデータセンターでサーバーを調査する。'},
 {id:'S004',bgGroup:'B003',phase:'night_scroll',narration:'夜の部屋でスマートフォンの画面を見る男性会社員が帰宅した。',assetComposition:'auto'},
 {id:'S005',bgGroup:'B004',phase:'unknown_phase',narration:'何も一致しない独自の学術実験が行われた。'}
];
// Explicit library scenes require all three high-scoring layers.
const plan=buildPlan(beats,original);
assert.equal(plan.scenes.S001.mode,'library');
assert.equal(plan.scenes.S001.background?.id,'bg-data-center');
assert.equal(plan.scenes.S002.background?.id,'bg-data-center');
assert.equal(plan.scenes.S003.background,null,'a plate may not be reused for a later group');
assert.equal(plan.scenes.S005.background,null,'a low match must remain bespoke');
assert.equal(plan.scenes.S001.person?.id,'person-engineer');
assert.equal(plan.scenes.S001.part?.id,'part-phone');
assert.equal(plan.scenes.S004.mode,'library','an auto storyboard uses a fully matching background and foreground');
assert.equal(plan.scenes.S005.mode,'bespoke','an unmatched auto storyboard preserves the original scene');
const phone=original.assets.find(a=>a.id==='part-phone');
assert.equal(rankAsset(phone,{phase:'data_center',narration:'データの分析とサーバーの画面'}, {...original.policy,threshold:original.threshold}),null,'phone requires an explicit phone/app concept');
assert.equal(plan.scenes.S001.background?.sha256,plan.scenes.S002.background?.sha256);
assert.throws(()=>buildPlan([{...beats[0],assetComposition:'library',narration:'unrelated'}],original),/no high-match background/);
assert.throws(()=>buildPlan([{...beats[0],id:'A',bgGroup:'ONE'}, {...beats[1],id:'B',bgGroup:'TWO'}, {...beats[2],id:'C',bgGroup:'ONE'}],original),/noncontiguous/);
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'video-assets-'));
try{
 fs.mkdirSync(path.join(tmp,'src'));fs.writeFileSync(path.join(tmp,'src/script-data.json'),JSON.stringify({beats:beats.map((b,i)=>i===0?{...b,assetComposition:'bespoke'}:b)}));
 const out=prepareEpisode(tmp);
 assert(fs.existsSync(path.join(tmp,'src/asset-plan.json')));
 for(const a of out.selectedAssets)assert(fs.existsSync(path.join(tmp,'public',a.file)));
 assert(fs.existsSync(path.join(tmp,'qa/asset-report.json')));
 console.log('Asset selection, strict threshold, continuity and copied assets: PASS');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
