import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
await generateVoicevox(root,{speaker:'青山龍星',style:'ノーマル',speed:0.98,pitchScale:-0.025,intonationScale:0.84});
