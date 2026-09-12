import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {BirthdayScene,BrothersScene,GeneticsScene,HistoryScene,LabScene,LivingRoomScene,SchoolScene,FeedbackScene,CareerScene,TwinScene,FinalScene,CaptionLayer,type Beat} from './scenes-fixed';

const beats=scriptData.beats as Beat[];
const birthday=new Set(['birthday_table','birthday_afterparty','final_home']);
const brothers=new Set(['split_brothers','two_paths','final_paths']);
const genetics=new Set(['chromosome_room','genetic_cards']);
const history=new Set(['galton_study','letters_archive','adler_room']);
const lab=new Set(['minnesota_lab','twin_testing','epigenetic_lab','brain_development','neural_noise','birth_order_data']);
const living=new Set(['livingroom_yuma','livingroom_naoto','house_layers','dinner_dialogue','reaction_loop','home_safety','terrain_home','family_album','album_perspective','family_system']);
const school=new Set(['school_gate','school_library','classroom_seat','festival_committee','newyear_family','identity_mirrors','preschool_twins','twin_divergence']);
const feedback=new Set(['feedback_spiral','chance_branch']);
const career=new Set(['career_yuma','career_naoto','university_split','network_event','photo_trip','environment_choice']);
const twins=new Set(['identical_twins_child','identical_twins_old']);
const finals=new Set(['night_walk','station_split','causal_web']);

const Visual=({beat,p}:{beat:Beat;p:number})=>{
  const v=beat.visual;
  if(birthday.has(v)) return <BirthdayScene beat={beat} p={p} mode={v}/>;
  if(brothers.has(v)) return <BrothersScene beat={beat} p={p} mode={v}/>;
  if(genetics.has(v)) return <GeneticsScene beat={beat} p={p} mode={v}/>;
  if(history.has(v)) return <HistoryScene beat={beat} p={p} mode={v}/>;
  if(lab.has(v)) return <LabScene beat={beat} p={p} mode={v}/>;
  if(living.has(v)) return <LivingRoomScene beat={beat} p={p} mode={v}/>;
  if(school.has(v)) return <SchoolScene beat={beat} p={p} mode={v}/>;
  if(feedback.has(v)) return <FeedbackScene beat={beat} p={p} mode={v}/>;
  if(career.has(v)) return <CareerScene beat={beat} p={p} mode={v}/>;
  if(twins.has(v)) return <TwinScene beat={beat} p={p} mode={v}/>;
  if(finals.has(v)) return <FinalScene beat={beat} p={p} mode={v}/>;
  return <FeedbackScene beat={beat} p={p} mode="feedback_spiral"/>;
};

export const V29SiblingsDiverge:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveBeatAtSeconds(frame/fps);
  const beat=beats[active.index]??beats[0];
  return <><Visual beat={beat} p={active.progress}/><CaptionLayer beat={beat} p={active.progress}/></>;
};
