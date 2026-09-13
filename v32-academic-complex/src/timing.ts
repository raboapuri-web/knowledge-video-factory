import sync from './sync-timing.json';

export const getActiveBeatAtSeconds=(seconds:number)=>{
  const beats=(sync.beats||[]) as Array<{id:string;index:number;start:number;end:number}>;
  if(!beats.length)return {index:0,progress:0};
  const found=beats.findIndex(b=>seconds>=b.start&&seconds<b.end);
  const idx=found<0?beats.length-1:found;
  const b=beats[idx];
  const span=Math.max(.001,b.end-b.start);
  return {index:idx,progress:Math.max(0,Math.min(1,(seconds-b.start)/span))};
};
