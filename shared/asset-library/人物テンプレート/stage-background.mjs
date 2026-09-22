import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {validateCatalog} from '../prepare.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const assetRoot=path.resolve(here,'..');
const digest=(file)=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');

/** Explicitly stage ONE catalog-approved background; never replace a unique scene
 * automatically or select a background by mere keyword similarity.
 */
export function stageBackground(episodeDir,backgroundFile){
  if(typeof backgroundFile!=='string'||!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)
    ||backgroundFile.includes('..'))throw Error('Pass a single registered background filename such as BG_office.png');
  const catalog=validateCatalog(JSON.parse(fs.readFileSync(path.join(assetRoot,'catalog.json'),'utf8')),assetRoot);
  const record=catalog.assets.find(a=>a.category==='背景'&&a.file==='背景/'+backgroundFile);
  if(!record)throw Error('Background not registered in catalog.json: '+backgroundFile);
  if(record.license==='pending-review'||record.autoRegistration?.needsVisualReview===true)
    throw Error('Background is pending review: '+backgroundFile);
  const src=path.join(assetRoot,'背景',backgroundFile);
  if(!fs.lstatSync(src).isFile()||fs.lstatSync(src).isSymbolicLink())
    throw Error('Background must be an original regular file: '+backgroundFile);
  const actual=digest(src);
  if(record.sourceSha256&&actual!==record.sourceSha256)
    throw Error('Background bytes changed since approval; synchronize and review it: '+backgroundFile);
  const dest=path.join(path.resolve(episodeDir),'public','assets','library','背景',backgroundFile);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.copyFileSync(src,dest);
  if(digest(dest)!==actual)throw Error('Background copy checksum mismatch: '+backgroundFile);
  return {backgroundFile,publicPath:'assets/library/背景/'+backgroundFile,sha256:actual};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const [episode,background]=process.argv.slice(2);
    if(!episode||!background)throw Error('usage: node shared/asset-library/人物テンプレート/stage-background.mjs <episode-dir> <BG_name.png>');
    console.log(JSON.stringify(stageBackground(episode,background)));
  }catch(error){console.error(error);process.exitCode=1;}
}
