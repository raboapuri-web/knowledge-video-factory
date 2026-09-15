import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const script=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));
const scenes=script.beats.map((b,i)=>({id:b.id,summary:b.narration.slice(0,42),sceneType:b.visual,templateSource:'One-off',visualIntent:`${b.visual}を台本固有の背景・人物配置・小道具・カメラ移動・前景アニメーションで表現し、前後シーンと背景構成を重複させない`,estimatedSeconds:18+(i%3)}));
const plan={videoId:script.videoId,title:script.title,reviewedBeforeImplementation:true,scenes};
fs.writeFileSync(path.join(root,'preproduction-plan.json'),JSON.stringify(plan,null,2));
console.log(`Preproduction plan materialized: ${scenes.length} one-off scenes`);
