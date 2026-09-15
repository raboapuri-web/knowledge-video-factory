import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const original=path.join(here,'v45-game-work.mjs');
const patched=path.join(here,'.v45-game-work-patched.mjs');
let src=fs.readFileSync(original,'utf8');

const replacements=[
  ["'xp_growth','flow_balance','raid_room'", "'xp_growth','flow_balance','flow_progression','raid_room'"],
  ["'morning_office','environment_contrast','efficiency_history'", "'morning_office','environment_contrast','work_inverse','efficiency_history'"],
  ["if(narrations.length!==64||families.length!==64) throw new Error(`Expected 64 scenes, got ${narrations.length}/${families.length}`);", "if(narrations.length!==66||families.length!==66) throw new Error(`Expected 66 scenes, got ${narrations.length}/${families.length}`);"],
  ["- 64 narration beats / 64 distinct visual keys.", "- 66 narration beats / 66 distinct visual keys."],
  ["'経験値','フロー','深夜のレイド'", "'経験値','フロー','成長する難易度','深夜のレイド'"],
  ["'翌朝10時','同じ人間','効率化の歴史'", "'翌朝10時','同じ人間','苦しくなる条件','効率化の歴史'"],
  ["case 'quest_complete': case 'quest_choice': case 'xp_growth': case 'flow_balance':", "case 'quest_complete': case 'quest_choice': case 'xp_growth': case 'flow_balance': case 'flow_progression':"],
  ["case 'sdt_intro': case 'job_model': case 'work_play': case 'environment_contrast': case 'efficiency_history': case 'final_thesis':", "case 'sdt_intro': case 'job_model': case 'work_play': case 'environment_contrast': case 'work_inverse': case 'efficiency_history': case 'final_thesis':"],
  ["default: return <CinematicScene n={64} family='final_thesis' title='努力の設計' accent='#7cc4ff' seed={42}/>;", "default: return <CinematicScene n={66} family='final_thesis' title='努力の設計' accent='#7cc4ff' seed={42}/>;"]
];
for(const [from,to] of replacements){
  if(!src.includes(from)) throw new Error(`V45 patch anchor missing: ${from}`);
  src=src.replace(from,to);
}
fs.writeFileSync(patched,src);
try {
  await import(pathToFileURL(patched).href+`?v=${Date.now()}`);
} finally {
  fs.rmSync(patched,{force:true});
}
