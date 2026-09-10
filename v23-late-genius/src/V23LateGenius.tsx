import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {ArchiveScene,CaptionLayer,HospitalScene,InnovationScene,IntelligenceScene,JungTrainScene,KnowledgeNetwork,KnowledgeNetwork as _unused,LectureScene,NetworkScene,OfficeNightScene,OldPainterScene,PersonaScene,PromotionScene,StationScene,SurgeryScene,WriterScene,YoungGeniusScene,type Beat} from './scenes';

const beats=scriptData.beats as Beat[];

const Visual=({beat,p}:{beat:Beat;p:number})=>{
  const v=beat.visual;
  if(['office_intro','award','reflection'].includes(v)) return <OfficeNightScene beat={beat} p={p} mode={v}/>;
  if(['young_rules','young_concept'].includes(v)) return <YoungGeniusScene beat={beat} p={p} mode={v}/>;
  if(v==='old_painter') return <OldPainterScene beat={beat} p={p}/>;
  if(['archive','archive_map'].includes(v)) return <ArchiveScene beat={beat} p={p} mode={v==='archive_map'?'map':'archive'}/>;
  if(['jung_train','jung_afternoon'].includes(v)) return <JungTrainScene beat={beat} p={p} mode={v==='jung_afternoon'?'afternoon':'train'}/>;
  if(['persona_game','persona_masks'].includes(v)) return <PersonaScene beat={beat} p={p} mode={v==='persona_masks'?'masks':'game'}/>;
  if(['hospital_walk','hospital_question'].includes(v)) return <HospitalScene beat={beat} p={p} mode={v==='hospital_question'?'question':'walk'}/>;
  if(['intelligence_bars','intelligence_compare'].includes(v)) return <IntelligenceScene beat={beat} p={p} mode={v==='intelligence_bars'?'bars':'compare'}/>;
  if(v==='surgery') return <SurgeryScene beat={beat} p={p}/>;
  if(v==='network') return <NetworkScene beat={beat} p={p}/>;
  if(['innovation','innovation_gradual'].includes(v)) return <InnovationScene beat={beat} p={p} mode={v==='innovation_gradual'?'gradual':'revolution'}/>;
  if(v==='promotion') return <PromotionScene beat={beat} p={p}/>;
  if(v==='writer') return <WriterScene beat={beat} p={p}/>;
  if(['lecture','lecture_questions','lecture_sudden'].includes(v)) return <LectureScene beat={beat} p={p} mode={v==='lecture_questions'?'questions':v==='lecture_sudden'?'sudden':'lecture'}/>;
  if(['station','station_hands','station_final'].includes(v)) return <StationScene beat={beat} p={p} mode={v==='station_hands'?'hands':v==='station_final'?'final':'station'}/>;
  return <OfficeNightScene beat={beat} p={p} mode="reflection"/>;
};

export const V23LateGenius:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveBeatAtSeconds(frame/fps);
  const beat=beats[active.index]??beats[0];
  return <><Visual beat={beat} p={active.progress}/><CaptionLayer beat={beat} p={active.progress}/></>;
};
