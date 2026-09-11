import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {AlgorithmScene,BathroomScene,CafeScene,CampusScene,CaptionLayer,DatingScene,DepartmentScene,HallyuScene,HeianScene,HeiseiMediaScene,HomeScene,IzakayaScene,LabScene,MediaScene,SalonScene,ShowaScene,TheoryScene,TrainCultureScene,type Beat} from './scenes';

const beats=scriptData.beats as Beat[];
const cafe=new Set(['shibuya_cafe_wide','shibuya_profile','shibuya_inference']);
const heian=new Set(['heian_room','heian_incense_poetry','bishonen_history']);
const showa=new Set(['showa_home','showa_commute','showa_scoreboard','showa_paycheck']);
const train=new Set(['train_1998','train_reflections','magazine_beauty']);
const lab=new Set(['lab_morph','lab_tradeoff','lab_natural_faces','lab_prediction_gap']);
const heisei=new Set(['heisei_livingroom','heisei_idol_stage']);
const hallyu=new Set(['hallyu_home','kpop_backstage','kpop_stage']);
const campus=new Set(['campus_cafeteria','campus_planning']);
const home=new Set(['dual_income_home']);
const dating=new Set(['dating_app_room','dating_signal_scan']);
const media=new Set(['cinema_to_phone','vertical_closeup','camera_metrics']);
const salon=new Set(['male_salon','salon_selfie']);
const bathroom=new Set(['morning_bathroom','beauty_labor_clock','subject_count']);
const izakaya=new Set(['izakaya_group','izakaya_assertive']);
const algorithm=new Set(['algorithm_feed','algorithm_learning','market_loop']);
const department=new Set(['department_cosmetics','father_memory','couple_meet','final_walk']);
const theory=new Set(['masculinity_old_new','evaluation_shift','hybrid_matrix','one_axis_to_multi','evaluation_columns','safety_package','soft_hard_balance','history_layers','multi_axis_final','weights_rebalance','final_statement']);

const Visual=({beat,p}:{beat:Beat;p:number})=>{
 const v=beat.visual;
 if(cafe.has(v)) return <CafeScene beat={beat} p={p} mode={v}/>;
 if(heian.has(v)) return <HeianScene beat={beat} p={p} mode={v}/>;
 if(showa.has(v)) return <ShowaScene beat={beat} p={p} mode={v}/>;
 if(train.has(v)) return <TrainCultureScene beat={beat} p={p} mode={v}/>;
 if(lab.has(v)) return <LabScene beat={beat} p={p} mode={v}/>;
 if(heisei.has(v)) return <HeiseiMediaScene beat={beat} p={p} mode={v}/>;
 if(hallyu.has(v)) return <HallyuScene beat={beat} p={p} mode={v}/>;
 if(campus.has(v)) return <CampusScene beat={beat} p={p} mode={v}/>;
 if(home.has(v)) return <HomeScene beat={beat} p={p} mode={v}/>;
 if(dating.has(v)) return <DatingScene beat={beat} p={p} mode={v}/>;
 if(media.has(v)) return <MediaScene beat={beat} p={p} mode={v}/>;
 if(salon.has(v)) return <SalonScene beat={beat} p={p} mode={v}/>;
 if(bathroom.has(v)) return <BathroomScene beat={beat} p={p} mode={v}/>;
 if(izakaya.has(v)) return <IzakayaScene beat={beat} p={p} mode={v}/>;
 if(algorithm.has(v)) return <AlgorithmScene beat={beat} p={p} mode={v}/>;
 if(department.has(v)) return <DepartmentScene beat={beat} p={p} mode={v}/>;
 if(theory.has(v)) return <TheoryScene beat={beat} p={p} mode={v}/>;
 return <TheoryScene beat={beat} p={p} mode="evaluation_shift"/>;
};

export const V26ReiwaMen:React.FC=()=>{
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const active=getActiveBeatAtSeconds(frame/fps);
 const beat=beats[active.index]??beats[0];
 return <><Visual beat={beat} p={active.progress}/><CaptionLayer beat={beat} p={active.progress}/></>;
};
