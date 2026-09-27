import React from 'react';
import data from './scene-data.json';
import {R,C} from './primitives';
import {renderStadiumOpening,renderRationalState,renderMythReplacement,renderPrintStation,renderImaginedCommunity,renderVillageScale,renderFrenchRevolution} from './phases-a';
import {renderFestivalSupreme,renderInventedTradition,renderRitualMemory,renderRenanSorbonne,renderHistoryClassroom,renderMuseumSelection,renderInauguration} from './phases-b';
import {renderCemetery,renderSolidarityTax,renderMeijiTokyo,renderEducationRescript,renderAdministrativeMachine,renderDisasterSolidarity,renderInstitutionAndStory} from './phases-c';
import {renderFutureCity,renderFutureGenerations,renderSchoolPhoto,renderMythBoundary,renderMythlessState,renderMythlessQuestion,renderStadiumReturn,renderFinalThesis} from './phases-d';

type Beat={id:string;phase:string;variant:number;narration:string;family:string;sceneKey:string;visual:string;bgGroup:string;bgSeed:number;shotKind:string};
const beats=data as Beat[];

const dispatch=(b:Beat,p:number):React.ReactNode=>{
 switch(b.phase){
  case'stadium_opening':return renderStadiumOpening(b.variant,p);
  case'rational_state':return renderRationalState(b.variant,p);
  case'myth_replacement':return renderMythReplacement(b.variant,p);
  case'print_station':return renderPrintStation(b.variant,p);
  case'imagined_community':return renderImaginedCommunity(b.variant,p);
  case'village_scale':return renderVillageScale(b.variant,p);
  case'french_revolution':return renderFrenchRevolution(b.variant,p);
  case'festival_supreme':return renderFestivalSupreme(b.variant,p);
  case'invented_tradition':return renderInventedTradition(b.variant,p);
  case'ritual_memory':return renderRitualMemory(b.variant,p);
  case'renan_sorbonne':return renderRenanSorbonne(b.variant,p);
  case'history_classroom':return renderHistoryClassroom(b.variant,p);
  case'museum_selection':return renderMuseumSelection(b.variant,p);
  case'inauguration':return renderInauguration(b.variant,p);
  case'cemetery':return renderCemetery(b.variant,p);
  case'solidarity_tax':return renderSolidarityTax(b.variant,p);
  case'meiji_tokyo':return renderMeijiTokyo(b.variant,p);
  case'education_rescript':return renderEducationRescript(b.variant,p);
  case'administrative_machine':return renderAdministrativeMachine(b.variant,p);
  case'disaster_solidarity':return renderDisasterSolidarity(b.variant,p);
  case'institution_and_story':return renderInstitutionAndStory(b.variant,p);
  case'future_city':return renderFutureCity(b.variant,p);
  case'future_generations':return renderFutureGenerations(b.variant,p);
  case'school_photo':return renderSchoolPhoto(b.variant,p);
  case'myth_boundary':return renderMythBoundary(b.variant,p);
  case'mythless_state':return renderMythlessState(b.variant,p);
  case'mythless_question':return renderMythlessQuestion(b.variant,p);
  case'stadium_return':return renderStadiumReturn(b.variant,p);
  case'final_thesis':return renderFinalThesis(b.variant,p);
  default:throw new Error('Unsupported V100 phase '+b.phase);
 }
};

export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const b=beats[n-1];if(!b)throw new Error('Missing V100 scene '+n);
 const p=Math.max(0,Math.min(1,progress));
 const scale=b.shotKind==='macro'?1.045:b.shotKind==='detail'?1.02:1;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden'}}>
   <g data-bg={b.bgGroup} data-scene={b.sceneKey} data-family={b.family} transform={'translate('+(960*(1-scale))+' '+(540*(1-scale))+') scale('+scale+')'}>{dispatch(b,p)}</g>
   <R x={0} y={0} w={1920} h={1080} c={C.night} o={.025}/>
 </svg>;
};
