import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v64-nishiazabu-moon');
const library=path.join(root,'template-assets');
if(!fs.existsSync(source)||!fs.existsSync(library)) throw new Error('V46 compatible source or shared asset checkout missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});
fs.rmSync(path.join(target,'public/assets'),{recursive:true,force:true});
fs.cpSync(path.join(library,'public/assets'),path.join(target,'public/assets'),{recursive:true});
fs.rmSync(path.join(target,'src/characters'),{recursive:true,force:true});
fs.cpSync(path.join(library,'src/characters'),path.join(target,'src/characters'),{recursive:true});

const sceneStarts=[
 ['taxi_open','西麻布のギャラ飲み帰りだった。','taxi'],
 ['taxi_message','スマホが震えた。','taxi'],
 ['ebisu_meeting','悠真とは、二十五歳の秋に出会った。','ebisu_izakaya'],
 ['date_walk','それから何度も会った。','date_walk'],
 ['yutenji_room','彼の部屋にも行った。','yutenji_room'],
 ['uncertain_love','でも、彼は一度も「付き合おう」とは言わなかった。','yutenji_room'],
 ['old_moon','ある夜、中目黒から祐天寺まで歩いていると、彼が空を見上げた。','meguro_walk'],
 ['old_chat','帰宅してから、彼とのトーク画面を開いた。','yutenji_room'],
 ['breakup','それから一ヶ月後、悠真に恋人ができた。','ebisu_cafe'],
 ['first_gallery','初めてギャラ飲みに行ったのは、その少しあとだった。','gallery'],
 ['taxi_return','タクシーが渋谷を過ぎた。','taxi'],
 ['taxi_moon','池尻大橋を過ぎたあたりで、ビルの隙間に月が見えた。','taxi'],
 ['taxi_exit','タクシーが三軒茶屋の交差点で止まった。','taxi'],
 ['sangen_street','料金を払って、車を降りる。','sangen_street'],
 ['milk','茶沢通りのコンビニに寄って、明日の朝の牛乳を買った。','convenience']
];
const script=fs.readFileSync(path.join(root,'shared/v64/nishiazabu-moon-script.txt'),'utf8').trim();
if(!script.startsWith('西麻布のギャラ飲み帰りだった。')||!script.endsWith('明日の朝の牛乳を買った。')) throw new Error('Incorrect V64 script');
fs.writeFileSync(path.join(target,'script.txt'),script+'\n');
const paras=script.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
let state=null;
const raw=[];
const seen=new Set();
for(const text of paras){
  const hits=sceneStarts.filter(([,anchor])=>text===anchor);
  if(hits.length){
    if(hits.length!==1||seen.has(hits[0][0])) throw new Error('Duplicate scene anchor: '+text);
    state={phase:hits[0][0],location:hits[0][2]};
    seen.add(state.phase);
  }
  if(!state) throw new Error('No opening scene phase');
  raw.push({...state,narration:text});
}
for(const [phase] of sceneStarts) if(!seen.has(phase)) throw new Error('Missing scene anchor '+phase);
const beats=[];
for(const rawBeat of raw){
  const previous=beats.at(-1);
  const isDialogue=/^[「『]/.test(rawBeat.narration);
  if(previous&&previous.phase===rawBeat.phase&&
    (previous.narration+' '+rawBeat.narration).length<=(isDialogue?38:53)){
      previous.narration+=' '+rawBeat.narration;
  }else beats.push({...rawBeat});
}
const perPhase=new Map();
beats.forEach((b,i)=>{
  const j=perPhase.get(b.phase)||0;
  perPhase.set(b.phase,j+1);
  b.id='S'+String(i+1).padStart(3,'0');
  b.visual=b.phase+'_'+String(j+1).padStart(2,'0');
  b.localIndex=j;
  b.shotKind='narrative-animation';
});
if(beats.length<55||beats.length>165) throw new Error('Unexpected shot count: '+beats.length);
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V64-nishiazabu-moon',title:'西麻布のギャラ飲み帰りに、タクシーの窓から見上げた月',beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,location,visual,localIndex,shotKind})=>({id,phase,location,visual,localIndex,shotKind})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:680,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({
 productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,
 preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,
 videoId:'V64-nishiazabu-moon',title:'西麻布のギャラ飲み帰りに、タクシーの窓から見上げた月'
},null,2));
fs.copyFileSync(path.join(root,'shared/v64/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v64/scenes.tsx'),path.join(target,'src/scenes.tsx'));
// V46 uses the shared Remotion/VOICEVOX/segmented-render pipeline. Use a female narration voice for this first-person female protagonist.
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),
  "import path from 'node:path';\nimport {fileURLToPath} from 'node:url';\nimport {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';\nconst root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');\nawait generateVoicevox(root,{speaker:'四国めたん',style:'ノーマル',speed:1.08,pitchScale:-0.045,intonationScale:0.79});\n");
// Detailed hand-drawn SVG sets, not template substitutions. Each location stays mounted across contiguous narration beats.
const svg=(body)=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">'+body+'</svg>';
const backgrounds={
 'BG_v64_taxi_night.svg':svg('<defs><linearGradient id="city" x2="0" y2="1"><stop stop-color="#070d22"/><stop offset="1" stop-color="#243048"/></linearGradient></defs><rect width="1920" height="1080" fill="#0e111c"/><path d="M65 0H1855V790H65Z" fill="url(#city)"/><path d="M40 690V350L110 330V510L170 510V290H250V480H335V200H410V575H500V260H580V475H650V360H730V490H810V190H875V490H960V365H1040V520H1120V270H1220V530H1300V310H1380V560H1450V240H1550V490H1640V300H1720V500H1840V710Z" fill="#151d32"/><path d="M45 730L1850 730 1880 790H35Z" fill="#111724"/><path d="M0 0H1920V100H0ZM0 0H92V1080H0ZM1828 0H1920V1080H1828ZM0 808H1920V1080H0Z" fill="#090c13"/><path d="M88 100L285 0M1830 100L1630 0" stroke="#626673" stroke-width="13"/><path d="M0 1080L420 800H1530L1920 1080" fill="#24222c"/><path d="M410 800V1080M1530 800V1080" stroke="#54505b" stroke-width="18"/><path d="M0 880H1920" stroke="#0b0d14" stroke-width="26"/>'),
 'BG_v64_gallery_night.svg':svg('<defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#19121f"/><stop offset="1" stop-color="#311f2d"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#wall)"/><rect y="740" width="1920" height="340" fill="#1a1219"/><rect x="70" y="160" width="620" height="410" rx="8" fill="#b89b72"/><rect x="100" y="192" width="560" height="346" fill="#24222b"/><path d="M160 462Q260 230 350 420T610 266" stroke="#bd8d75" stroke-width="35" fill="none"/><rect x="1240" y="145" width="540" height="410" rx="9" fill="#8c7760"/><rect x="1268" y="172" width="486" height="357" fill="#161824"/><circle cx="1520" cy="340" r="104" fill="#524154"/><path d="M1300 475L1550 225 1680 490Z" fill="#a78279"/><path d="M200 850Q960 660 1720 850V1080H200Z" fill="#33212d"/><ellipse cx="980" cy="845" rx="650" ry="120" fill="#372936"/><ellipse cx="960" cy="815" rx="550" ry="82" fill="#6b4b4b"/><path d="M470 838H1460L1320 1080H610Z" fill="#291d26"/><path d="M660 805H1300" stroke="#d0b28b" stroke-width="12"/><path d="M890 380V770M1120 375V765" stroke="#d0b28b" stroke-width="10"/><path d="M835 380Q885 465 940 380M1060 375Q1115 470 1170 375" stroke="#c3a6a0" stroke-width="8" fill="none"/>'),
 'BG_v64_yutenji_1k.svg':svg('<defs><linearGradient id="sun" x2="0" y2="1"><stop stop-color="#f9d9af"/><stop offset="1" stop-color="#9db1bb"/></linearGradient></defs><rect width="1920" height="1080" fill="#a39e9b"/><rect x="110" y="115" width="700" height="650" fill="#ddd5c7" stroke="#766e6c" stroke-width="18"/><rect x="150" y="155" width="620" height="575" fill="url(#sun)"/><path d="M470 155V730M150 440H770" stroke="#988c80" stroke-width="19"/><path d="M150 640Q355 530 520 610T770 590V730H150Z" fill="#b8a9a1"/><path d="M1000 0H1920V790H1000Z" fill="#c3b8a8"/><rect x="1260" y="240" width="490" height="410" fill="#8f8a81"/><rect x="1290" y="267" width="430" height="352" fill="#ddd4bd"/><path d="M1310 400H1700M1310 490H1700M1450 280V610" stroke="#7c756d" stroke-width="15"/><rect x="1160" y="680" width="650" height="150" rx="18" fill="#635b57"/><rect y="765" width="1920" height="315" fill="#796d68"/><path d="M40 815H1110V1040H40Z" fill="#eee9df"/><path d="M75 820H410V1030H75Z" fill="#f7f2e9"/><path d="M900 760H1160V1010H900Z" fill="#5c4c43"/><rect x="930" y="650" width="190" height="120" rx="12" fill="#e6d9bc"/>'),
 'BG_v64_ebisu_cafe.svg':svg('<defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#c9b9a2"/><stop offset="1" stop-color="#e6d9c7"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/><rect x="125" y="120" width="930" height="600" fill="#473b39"/><rect x="157" y="150" width="865" height="535" fill="#aab7b6"/><path d="M157 550Q350 465 600 550T1022 480V685H157Z" fill="#6d7771"/><path d="M570 145V685M157 420H1022" stroke="#e0d1bd" stroke-width="18"/><rect x="1110" y="215" width="680" height="525" fill="#a88d78"/><rect x="1170" y="265" width="560" height="420" fill="#d4c4ad"/><path d="M0 765H1920V1080H0Z" fill="#8d7164"/><path d="M420 765Q960 600 1510 765L1610 1080H320Z" fill="#5c4740"/><ellipse cx="975" cy="760" rx="560" ry="130" fill="#806257"/>'),
 'BG_v64_convenience.svg':svg('<rect width="1920" height="1080" fill="#d6dada"/><rect x="0" y="0" width="1920" height="200" fill="#edf3f1"/><rect x="50" y="220" width="1820" height="650" fill="#a6b8b9"/><rect x="90" y="245" width="1740" height="590" fill="#e7eff0"/><path d="M110 430H1810M110 620H1810" stroke="#759195" stroke-width="18"/><path d="M110 800H1810" stroke="#5b7d84" stroke-width="26"/><rect x="350" y="300" width="125" height="125" rx="8" fill="#fafafa"/><rect x="520" y="300" width="125" height="125" rx="8" fill="#fafafa"/><rect x="690" y="300" width="125" height="125" rx="8" fill="#fafafa"/><rect x="860" y="300" width="125" height="125" rx="8" fill="#fafafa"/><path d="M375 340H450M545 340H620M715 340H790M885 340H960" stroke="#4b7294" stroke-width="12"/><rect y="850" width="1920" height="230" fill="#bdc3c2"/>')
};
const dest=path.join(target,'public/assets/backgrounds');
fs.mkdirSync(dest,{recursive:true});
for(const [name,body] of Object.entries(backgrounds)) fs.writeFileSync(path.join(dest,name),body+'\n');

fs.writeFileSync(path.join(target,'IMPLEMENTATION_PLAN.md'),
'# V64 西麻布のギャラ飲み帰りに、タクシーの窓から見上げた月\n\n'+
'- Production base: V46 Remotion/VOICEVOX measured narration, subtitles, segmented rendering, BGM, pre/post QA and GitHub Release.\n'+
'- Every narration beat has its own visual key; contiguous beats in the same location keep the same underlying stage, moving/removing/adding props and characters rather than resetting backgrounds.\n'+
'- Night taxi is a persistent animated stage with moving road, buildings, light streaks, interior and window reflection. The moon appears only when the narration reaches it. Phone and message overlays follow the spoken actions.\n'+
'- Bespoke SVG sets: taxi, West Azabu gallery, Yutenji six-tatami apartment, Ebisu cafe, convenience-store milk shelf. Existing template backgrounds are used only when the described geography matches.\n'+
'- Full first-person female script is used unchanged and narrated using a female VOICEVOX voice; visuals explicitly depict Ebisu, Nakameguro, Megurogawa, Yutenji, Nishiazabu, Ikejiri-ohashi, Sangenjaya and Chazawa-dori.\n'+
'- Any literal backslash-n in visible video text is forbidden and verified before rendering.\n');
console.log('V64 materialized:',beats.length,'shots',sceneStarts.length,'phases',Object.keys(backgrounds).length,'new backgrounds');
