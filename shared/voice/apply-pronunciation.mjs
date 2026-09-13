import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const defaultDictionaryPath=path.resolve(here,'../production-rules/voice-pronunciation.json');
const kanji='一-龯々〆ヵヶ';
const digits='0-9０-９';
const kana='ぁ-んァ-ヶー';

const escapeRegExp=(s)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

export const loadPronunciationRules=(dictionaryPath=defaultDictionaryPath)=>{
  const data=JSON.parse(fs.readFileSync(dictionaryPath,'utf8'));
  return (data.rules||[]).filter(r=>r.enabled!==false).sort((a,b)=>(b.priority||0)-(a.priority||0));
};

export const applyPronunciationRules=(text,rules=loadPronunciationRules())=>{
  let out=text;
  const applied=[];
  for(const rule of rules){
    const before=out;
    if(rule.mode==='standalone'){
      // A standalone rule targets an independent lexical item, not a compound,
      // numeric counter, or inflected word stem. Some one-character rules (e.g. 上)
      // also opt out when preceded by kana so 「年収も上がった」「積み上がる」
      // cannot be mistaken for an isolated token.
      const leftChars=`${kanji}${digits}${rule.disallowPrecedingKana?kana:''}`;
      const re=new RegExp(`(?<![${leftChars}])${escapeRegExp(rule.target)}(?![${kanji}])`,'g');
      out=out.replace(re,rule.replacement);
    }else if(rule.mode==='phrase'){
      out=out.split(rule.target).join(rule.replacement);
    }else if(rule.mode==='regex'&&rule.pattern){
      out=out.replace(new RegExp(rule.pattern,rule.flags||'g'),rule.replacement);
    }
    if(out!==before) applied.push(rule.id);
  }
  return {text:out,applied};
};
