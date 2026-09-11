import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {AIScene,CaptionLayer,ConsultScene,FunnelScene,GarageScene,HistoryScene,LogisticsScene,MarketScene,OfficeInfoScene,RegulationScene,SeminarScene,StudioScene,StudentScene,SunkScene,TheoryScene,TrainScene,WebinarScene,ZoomScene,type Beat} from './scenes-fixed';

const beats=scriptData.beats as Beat[];

const webinar=new Set(['webinar_room','webinar_host','countdown_offer','purchase_relief','three_months_later','upsell_mail','question_market']);
const funnel=new Set(['funnel_phone','salary_monday']);
const history=new Set(['newspaper_press','old_postoffice','mail_fraud_map','fifties_kitchen','homework_parcel','motivation_not_laziness']);
const officeInfo=new Set(['lunch_course','information_flood','single_path']);
const garage=new Set(['garage_arrival','credence_cutaway','course_credence','blame_balance']);
const seminar=new Set(['luxury_seminar','price_signal']);
const students=new Set(['hundred_students','three_spotlights','missing_denominator','optimism_self','control_illusion']);
const sunk=new Set(['payment_history','sunk_cost_stairs','backward_door']);
const consult=new Set(['consult_call','moving_causes','unfalsifiable_loop']);
const market=new Set(['used_car_market','lemon_filter','trust_signals']);
const zoom=new Set(['zoom_grid','identity_badge','exit_cost_identity']);
const logistics=new Set(['old_fulfillment','digital_fulfillment','buyer_as_ad']);
const regulation=new Set(['regulation_office','label_morph','three_conditions']);
const ai=new Set(['ai_night','ai_branching','human_certainty','certainty_market']);
const train=new Set(['train_home','station_exit']);
const theory=new Set(['causal_web','history_triptych','control_future','secret_reveal']);
const studio=new Set(['studio_setup','studio_record','final_answer']);

const Visual=({beat,p}:{beat:Beat;p:number})=>{
 const v=beat.visual;
 if(webinar.has(v)) return <WebinarScene beat={beat} p={p} mode={v}/>;
 if(funnel.has(v)) return <FunnelScene beat={beat} p={p} mode={v}/>;
 if(history.has(v)) return <HistoryScene beat={beat} p={p} mode={v}/>;
 if(officeInfo.has(v)) return <OfficeInfoScene beat={beat} p={p} mode={v}/>;
 if(garage.has(v)) return <GarageScene beat={beat} p={p} mode={v}/>;
 if(seminar.has(v)) return <SeminarScene beat={beat} p={p} mode={v}/>;
 if(students.has(v)) return <StudentScene beat={beat} p={p} mode={v}/>;
 if(sunk.has(v)) return <SunkScene beat={beat} p={p} mode={v}/>;
 if(consult.has(v)) return <ConsultScene beat={beat} p={p} mode={v}/>;
 if(market.has(v)) return <MarketScene beat={beat} p={p} mode={v}/>;
 if(zoom.has(v)) return <ZoomScene beat={beat} p={p} mode={v}/>;
 if(logistics.has(v)) return <LogisticsScene beat={beat} p={p} mode={v}/>;
 if(regulation.has(v)) return <RegulationScene beat={beat} p={p} mode={v}/>;
 if(ai.has(v)) return <AIScene beat={beat} p={p} mode={v}/>;
 if(train.has(v)) return <TrainScene beat={beat} p={p} mode={v}/>;
 if(studio.has(v)) return <StudioScene beat={beat} p={p} mode={v}/>;
 if(theory.has(v)) return <TheoryScene beat={beat} p={p} mode={v}/>;
 return <TheoryScene beat={beat} p={p} mode={v}/>;
};

export const V25InfoProducts:React.FC=()=>{
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const active=getActiveBeatAtSeconds(frame/fps);
 const beat=beats[active.index]??beats[0];
 return <><Visual beat={beat} p={active.progress}/><CaptionLayer beat={beat} p={active.progress}/></>;
};
