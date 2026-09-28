import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';
const home=path.dirname(fileURLToPath(import.meta.url));
await generateVoicevox(path.resolve(home,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.18,pitchScale:-0.026,intonationScale:0.86,padDuration:0.14});