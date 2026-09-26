import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd();
const episode=path.resolve(process.argv[2]||'v84-ai-extinction');
const lib=path.join(root,'shared/asset-library');
const catalog=JSON.parse(fs.readFileSync(path.join(lib,'catalog.json'),'utf8'));
const selected=['BG_office.png','BG_kenkyu.png','BG_syosai.png','BG_bank.png','BG_town.png','BG_darkroom.png'];
const sha=(p)=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const staged=[];
for(const name of selected){
 const rec=catalog.assets.find(a=>a.category==='背景'&&a.file==='背景/'+name);
 if(!rec)throw Error('V84 background not registered: '+name);
 if(!['original-project','cleared-commercial'].includes(rec.license))throw Error('V84 background rights not approved: '+name);
 if(rec.autoRegistration?.needsVisualReview===true)throw Error('V84 background still needs review: '+name);
 const src=path.join(lib,'背景',name);
 if(!fs.existsSync(src)||!fs.lstatSync(src).isFile()||fs.lstatSync(src).isSymbolicLink())throw Error('invalid V84 background file: '+name);
 const actual=sha(src);
 if(rec.sourceSha256&&rec.sourceSha256!==actual)throw Error('V84 background bytes changed since approval: '+name);
 const dest=path.join(episode,'public/assets/library/背景',name);
 fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest);
 if(sha(dest)!==actual)throw Error('V84 staged checksum mismatch: '+name);
 staged.push({name,license:rec.license,sha256:actual});
}
fs.mkdirSync(path.join(episode,'qa'),{recursive:true});
fs.writeFileSync(path.join(episode,'qa/v84-template-assets.json'),JSON.stringify({staged,characters:[
 '人物テンプレート/office-worker-rig.tsx','人物テンプレート/office-woman-rig.tsx',
 '人物テンプレート/RESEARCHER_MAN.tsx','人物テンプレート/RESEARCHER_WOMAN.tsx','人物テンプレート/PASSERBY.tsx'
]},null,2)+'\n');
console.log('V84 staged '+staged.length+' approved backgrounds with checksum verification');
