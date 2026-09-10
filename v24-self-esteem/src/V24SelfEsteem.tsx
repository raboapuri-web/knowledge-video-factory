import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {AgingScene,BarScene,BathroomScene,CampScene,CaptionLayer,DatingScene,HomeScene,IzakayaScene,MessagesScene,OfficeScene,PhotoScene,RamenScene,SalonScene,SchoolScene,SoccerScene,TheoryScene,type Beat} from './scenes';

const beats=scriptData.beats as Beat[];
const theory=new Set(['ranking_world','ranking_crack','belonging_signals','sociometer','sociometer_people','comparison_ladder','casino_selfworth','chips_saeki','chips_yamada','upward_compare','beauty_treadmill','stock_selfesteem','self_pages','self_concept','relationship_loop','self_efficacy','stable_floor','portfolio','endless_rank','many_seats','mirror_not_all','identity_mosaic','world_currencies','skill_compounding']);

const Visual=({beat,p}:{beat:Beat;p:number})=>{
 const v=beat.visual;
 if(v.startsWith('izakaya_')||v==='photo_memory') return <IzakayaScene beat={beat} p={p} mode={v}/>;
 if(theory.has(v)) return <TheoryScene beat={beat} p={p} mode={v}/>;
 if(v==='soccer_field'||v==='soccer_evening') return <SoccerScene beat={beat} p={p} evening={v==='soccer_evening'}/>;
 if(['home_repair','friend_visit','home_final'].includes(v)) return <HomeScene beat={beat} p={p} mode={v}/>;
 if(v==='salon_arrival'||v==='salon_feed') return <SalonScene beat={beat} p={p} feed={v==='salon_feed'}/>;
 if(v==='bar_entry'||v==='bar_mirrors') return <BarScene beat={beat} p={p} mirrors={v==='bar_mirrors'}/>;
 if(['office_compliment','likes_decay','meeting_feedback','meeting_after'].includes(v)) return <OfficeScene beat={beat} p={p} mode={v}/>;
 if(v==='dating_app'||v==='identity_search') return <DatingScene beat={beat} p={p} identity={v==='identity_search'}/>;
 if(v==='bathroom_mirror'||v==='localize_flaw') return <BathroomScene beat={beat} p={p} localize={v==='localize_flaw'}/>;
 if(['camp_arrival','camp_problem','camp_fire'].includes(v)) return <CampScene beat={beat} p={p} mode={v}/>;
 if(v==='school_festival') return <SchoolScene beat={beat} p={p}/>;
 if(v==='saeki_aging'||v==='infinite_feed') return <AgingScene beat={beat} p={p}/>;
 if(v==='ramen_shop'||v==='ramen_talk') return <RamenScene beat={beat} p={p} talk={v==='ramen_talk'}/>;
 if(v==='group_photo_return'||v==='photo_meaning') return <PhotoScene beat={beat} p={p} meaning={v==='photo_meaning'}/>;
 if(v==='messages_belonging') return <MessagesScene beat={beat} p={p}/>;
 return <TheoryScene beat={beat} p={p} mode={v}/>;
};

export const V24SelfEsteem:React.FC=()=>{
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const active=getActiveBeatAtSeconds(frame/fps);
 const beat=beats[active.index]??beats[0];
 return <><Visual beat={beat} p={active.progress}/><CaptionLayer beat={beat} p={active.progress}/></>;
};
