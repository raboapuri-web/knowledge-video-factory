/**
 * Idempotently append reusable video material candidates to the original Google Sheet.
 * Required GitHub Actions secrets:
 *   MATERIAL_MASTER_SHEET_ID: native Google Sheets spreadsheet ID (never commit it)
 *   MATERIAL_MASTER_SERVICE_ACCOUNT_JSON: service-account JSON, with Editor access to the spreadsheet
 *
 * Candidate manifests: shared/material-candidates/vNN.json
 * This script only appends to A:C; column D (登録) stays empty for unproduced assets.
 */
import {readFile,readdir} from 'node:fs/promises';
import {createSign} from 'node:crypto';
import {resolve} from 'node:path';

const sheetId=process.env.MATERIAL_MASTER_SHEET_ID;
const serviceJson=process.env.MATERIAL_MASTER_SERVICE_ACCOUNT_JSON;
if(!sheetId||!serviceJson){
 console.log('Material-master sync is NOT configured; skipping. Configure both GitHub Actions secrets.');
 process.exit(0);
}
const sa=JSON.parse(serviceJson);
if(!sa.client_email||!sa.private_key)throw Error('Invalid Google service-account credentials');
const normalize=s=>String(s??'').normalize('NFKC').toLowerCase().replace(/[\s・･、，,（）()／/ー\\-]/g,'');
const b64=v=>Buffer.from(typeof v==='string'?v:JSON.stringify(v)).toString('base64url');
const now=Math.floor(Date.now()/1000);
const base=b64({alg:'RS256',typ:'JWT'})+'.'+b64({
 iss:sa.client_email,scope:'https://www.googleapis.com/auth/spreadsheets',
 aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3500
});
const sign=createSign('RSA-SHA256');sign.update(base);sign.end();
const assertion=base+'.'+sign.sign(sa.private_key).toString('base64url');
const oauth=await fetch('https://oauth2.googleapis.com/token',{
 method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
 body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})
});
if(!oauth.ok)throw Error('Google OAuth token acquisition failed: HTTP '+oauth.status);
const token=(await oauth.json()).access_token;
const api=async(path,options={})=>{
 const response=await fetch('https://sheets.googleapis.com/v4/spreadsheets/'+encodeURIComponent(sheetId)+path,{
 ...options,headers:{Authorization:'Bearer '+token,...options.headers}});
 if(!response.ok)throw Error('Google Sheets update failed: HTTP '+response.status+' '+(await response.text()).slice(0,250));
 return response.json();
};
const tab="'シート1'";
const current=await api('/values/'+encodeURIComponent(tab+'!A1:D')+'?majorDimension=ROWS');
// A blank row in column D means a *candidate*, not a produced material.
const names=new Set((current.values??[]).slice(1).map(row=>normalize(row[1])).filter(Boolean));
const manifests=resolve('shared/material-candidates');
const files=(await readdir(manifests)).filter(f=>/^v\d+\.json$/.test(f)).sort();
const pending=[];
for(const filename of files){
 const manifest=JSON.parse(await readFile(resolve(manifests,filename),'utf8'));
 for(const c of manifest.candidates??[]){
  if(!['背景','パーツ','人物'].includes(c.category))throw Error('Invalid material category in '+filename);
  const name=String(c.name??'').trim(),use=String(c.use_case??'').trim();
  if(!name||!use)throw Error('Incomplete candidate in '+filename);
  const key=normalize(name);
  if(names.has(key))continue;
  names.add(key);pending.push([c.category,name,use,'']);
 }
}
if(!pending.length){console.log('No new material candidates; original sheet unchanged.');process.exit(0);}
const endpoint='/values/'+encodeURIComponent(tab+'!A:D')+':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS';
const result=await api(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify({majorDimension:'ROWS',values:pending})});
console.log('Added '+pending.length+' new reusable materials: '+result.updates?.updatedRange);
