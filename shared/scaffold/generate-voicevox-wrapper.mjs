import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateVoicevox} from '../voice/generate-voicevox.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const videoRoot=path.resolve(here,'..','..','YOUR_VIDEO_DIR');
await generateVoicevox(videoRoot);
