import fs from 'node:fs';
const path='src/scenes-v38.tsx';
let s=fs.readFileSync(path,'utf8');
s=s.replace('color=C.gold/>','color={C.gold}/>');
fs.writeFileSync(path,s);
console.log('V38 renderer syntax patch applied');
