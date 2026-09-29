import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';

const home=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(home,'..');
const scriptFile=path.join(root,'src/script-data.json');
const script=JSON.parse(fs.readFileSync(scriptFile,'utf8'));

// V106-specific pronunciation is applied only to spoken text, not subtitles.
// The shared global dictionary currently reads 金 as かね in several bullion
// passages, and reads the 人 suffix in スイス人 / ユダヤ人 as ひと.
const bullionPhrases=[
  ['金の取引','きんの取引'],
  ['金の中には','きんの中には'],
  ['された金も','されたきんも'],
  ['金は、溶かして','きんは、溶かして'],
  ['金の出どころ','きんの出どころ'],
  ['金や貿易','きんや貿易'],
];
let corrected=0;
for(const beat of script.beats){
  let spoken=beat.narration;
  for(const [before,after] of bullionPhrases)spoken=spoken.replaceAll(before,after);
  spoken=spoken.replaceAll('スイス人','スイスじん').replaceAll('ユダヤ人','ユダヤじん');
  if(spoken!==beat.narration){beat.speech=spoken;corrected++;}
}
if(corrected<9)throw Error('V106 pronunciation safeguards failed: only '+corrected+' corrected narration records');
fs.writeFileSync(scriptFile,JSON.stringify(script,null,2));
console.log('V106 episode-specific pronunciation prepared: '+corrected+' narration records; on-screen subtitles unchanged');
await generateVoicevox(root,{speaker:'青山龍星',style:'ノーマル',speed:1.19,pitchScale:-0.026,intonationScale:0.85,padDuration:0.13});
