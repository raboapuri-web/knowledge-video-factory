import React from 'react';
import data from './scene-data.json';
import {C,R} from './primitives';
import {renderMountainBorder,renderSameWorld,renderMedievalVillage,renderLayeredAuthority,renderFrontierRoad,renderSurveyors,renderMapmaking} from './phases-a';
import {renderWestphalia,renderMarketTax,renderCensusState,renderPublicGoods,renderCrimeBoundary,renderPowerStopline,renderPostwarOrder} from './phases-b';
import {renderDomesticMarket,renderBorderTrade,renderPassportStation,renderPassportBureaucracy,renderSchengenDrive,renderSchengenCooperation,renderWelfareServices} from './phases-c';
import {renderAdminResponsibility,renderColonialMap,renderDividedCommunity,renderBorderlessNight,renderBorderlessNoon,renderGovernanceReplace,renderFinalBorder} from './phases-d';

type Beat={id:string;phase:string;variant:number;narration:string;family:string;sceneKey:string;visual:string;bgGroup:string;bgSeed:number;shotKind:string};
const beats=data as Beat[];

const dispatch=(b:Beat,p:number):React.ReactNode=>{
 switch(b.phase){
  case'mountain_border':return renderMountainBorder(b.variant,p);
  case'same_world':return renderSameWorld(b.variant,p);
  case'medieval_village':return renderMedievalVillage(b.variant,p);
  case'layered_authority':return renderLayeredAuthority(b.variant,p);
  case'frontier_road':return renderFrontierRoad(b.variant,p);
  case'surveyors':return renderSurveyors(b.variant,p);
  case'mapmaking':return renderMapmaking(b.variant,p);
  case'westphalia_myth':return renderWestphalia(b.variant,p);
  case'market_tax':return renderMarketTax(b.variant,p);
  case'census_state':return renderCensusState(b.variant,p);
  case'public_goods':return renderPublicGoods(b.variant,p);
  case'crime_boundary':return renderCrimeBoundary(b.variant,p);
  case'power_stopline':return renderPowerStopline(b.variant,p);
  case'postwar_order':return renderPostwarOrder(b.variant,p);
  case'domestic_market':return renderDomesticMarket(b.variant,p);
  case'border_trade':return renderBorderTrade(b.variant,p);
  case'passport_station':return renderPassportStation(b.variant,p);
  case'passport_bureaucracy':return renderPassportBureaucracy(b.variant,p);
  case'schengen_drive':return renderSchengenDrive(b.variant,p);
  case'schengen_cooperation':return renderSchengenCooperation(b.variant,p);
  case'welfare_services':return renderWelfareServices(b.variant,p);
  case'admin_responsibility':return renderAdminResponsibility(b.variant,p);
  case'colonial_map':return renderColonialMap(b.variant,p);
  case'divided_community':return renderDividedCommunity(b.variant,p);
  case'borderless_night':return renderBorderlessNight(b.variant,p);
  case'borderless_noon':return renderBorderlessNoon(b.variant,p);
  case'governance_replace':return renderGovernanceReplace(b.variant,p);
  case'final_border':return renderFinalBorder(b.variant,p);
  default:throw new Error('Unsupported V99 phase '+b.phase);
 }
};

export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const b=beats[n-1];if(!b)throw new Error('Missing V99 scene '+n);
 const p=Math.max(0,Math.min(1,progress));
 const scale=b.shotKind==='macro'?1.055:b.shotKind==='detail'?1.025:1;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden'}}>
   <g data-bg={b.bgGroup} data-scene={b.sceneKey} data-family={b.family} transform={'translate('+(960*(1-scale))+' '+(540*(1-scale))+') scale('+scale+')'}>{dispatch(b,p)}</g>
   <R x={0} y={0} w={1920} h={1080} c={C.night} o={.028}/>
 </svg>;
};
