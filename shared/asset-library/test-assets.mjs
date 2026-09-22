import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildPlan,prepareEpisode,validateCatalog,rankAsset} from './prepare.mjs';
const catalog=validateCatalog();
assert(catalog.assets.every(a=>a.category==='パーツ'));
const beats=[
 {id:'S001',bgGroup:'B001',phase:'data_center',narration:'データセンターのサーバーに情報が収集され、技術者はスマートフォンの画面を見る。',assetComposition:'parts-overlay'},
 {id:'S002',bgGroup:'B001',phase:'data_center',narration:'スマートフォンの画面でデータを見る。',assetComposition:'auto'},
 {id:'S003',bgGroup:'B002',phase:'data_center',narration:'スマートフォンの画面を開いた。',assetComposition:'auto'},
 {id:'S004',bgGroup:'B003',phase:'night_scroll',narration:'夜にスマートフォンで動画を見る。',assetComposition:'auto'},
 {id:'S005',bgGroup:'B004',phase:'unknown_phase',narration:'何も一致しない独自の学術実験が行われた。',assetComposition:'auto'}
];
const plan=buildPlan(beats,catalog);
assert.equal(plan.scenes.S001.mode,'parts-overlay');
assert.equal(plan.scenes.S001.part?.id,'part-phone');
assert.equal(plan.scenes.S002.mode,'suggested','auto suggestions never draw over authored art');
assert.equal(plan.scenes.S003.part,null,'cooldown prevents overreuse in a new group');
assert.equal(plan.scenes.S004.mode,'bespoke','no eligible part available after cooldown');
assert.equal(plan.scenes.S005.mode,'bespoke');
const phone=catalog.assets.find(a=>a.id==='part-phone');
assert.equal(rankAsset(phone,{phase:'data_center',narration:'データの分析とサーバーの画面'},{...catalog.policy,threshold:catalog.threshold}),null,'screen must not imply smartphone');
assert.throws(()=>buildPlan([{...beats[0],narration:'unrelated'}],catalog),/no high-match prop/);
assert.throws(()=>buildPlan([{...beats[0],id:'A',bgGroup:'ONE'}, {...beats[1],id:'B',bgGroup:'TWO'}, {...beats[2],id:'C',bgGroup:'ONE'}],catalog),/noncontiguous/);
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'video-assets-'));
try{
 fs.mkdirSync(path.join(tmp,'src'));
 fs.writeFileSync(path.join(tmp,'src/script-data.json'),JSON.stringify({beats}));
 const output=prepareEpisode(tmp);
 assert(fs.existsSync(path.join(tmp,'src/asset-plan.json')));
 assert(fs.existsSync(path.join(tmp,'qa/asset-report.json')));
 for(const a of output.selectedAssets)assert(fs.existsSync(path.join(tmp,'public',a.file)));
 assert(!fs.existsSync(path.join(tmp,'public/assets/library/背景')));
 assert(!fs.existsSync(path.join(tmp,'public/assets/library/人物')));
 console.log('Part-only catalog, match threshold, safe suggestion, overlay and staging: PASS');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
