import React from 'react';
import data from './scene-data.json';
import {C,R} from './primitives';
import {renderIntroMotherA,renderIntroMotherB,renderChildcareEvidence,renderOpeningParadox,renderBritainVillage,renderWorkhouseGates,renderLessEligibility} from './phases-a';
import {renderWorkhouseDebate,renderEligibilityLine,renderUsSupermarket,renderBenefitCliff,renderUsChoice,renderProgramOverlap,renderFranceApartment} from './phases-b';
import {renderLandlordDecision,renderFackAnalysis,renderRentalOutsider,renderMarketSpillover,renderWorkingFamily,renderUnableToWork,renderMedicaidEnvelopes} from './phases-c';
import {renderMedicaidProcedural,renderAdministrativeBurden,renderSupportBenefits,renderPolicyTradeoffs,renderEpilogueTwoRooms,renderEpilogueThesis} from './phases-d';

export type Beat={id:string;phase:string;variant:number;narration:string;family:string;sceneKey:string;actionId:string;visual:string;bgGroup:string;shotKind:string};
const beats=data as Beat[];

const dispatch=(b:Beat,p:number):React.ReactNode=>{
 switch(b.phase){
 case'intro_mother_a':return renderIntroMotherA(b.variant,p);
 case'intro_mother_b':return renderIntroMotherB(b.variant,p);
 case'childcare_evidence':return renderChildcareEvidence(b.variant,p);
 case'opening_paradox':return renderOpeningParadox(b.variant,p);
 case'britain_village':return renderBritainVillage(b.variant,p);
 case'workhouse_gates':return renderWorkhouseGates(b.variant,p);
 case'less_eligibility':return renderLessEligibility(b.variant,p);
 case'workhouse_debate':return renderWorkhouseDebate(b.variant,p);
 case'eligibility_line':return renderEligibilityLine(b.variant,p);
 case'us_supermarket':return renderUsSupermarket(b.variant,p);
 case'benefit_cliff':return renderBenefitCliff(b.variant,p);
 case'us_choice':return renderUsChoice(b.variant,p);
 case'program_overlap':return renderProgramOverlap(b.variant,p);
 case'france_apartment':return renderFranceApartment(b.variant,p);
 case'landlord_decision':return renderLandlordDecision(b.variant,p);
 case'fack_analysis':return renderFackAnalysis(b.variant,p);
 case'rental_outsider':return renderRentalOutsider(b.variant,p);
 case'market_spillover':return renderMarketSpillover(b.variant,p);
 case'working_family':return renderWorkingFamily(b.variant,p);
 case'unable_to_work':return renderUnableToWork(b.variant,p);
 case'medicaid_envelopes':return renderMedicaidEnvelopes(b.variant,p);
 case'medicaid_procedural':return renderMedicaidProcedural(b.variant,p);
 case'administrative_burden':return renderAdministrativeBurden(b.variant,p);
 case'support_benefits':return renderSupportBenefits(b.variant,p);
 case'policy_tradeoffs':return renderPolicyTradeoffs(b.variant,p);
 case'epilogue_two_rooms':return renderEpilogueTwoRooms(b.variant,p);
 case'epilogue_thesis':return renderEpilogueThesis(b.variant,p);
 default:throw new Error('Unsupported V102 phase: '+b.phase);
 }
};

export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const b=beats[n-1];if(!b)throw new Error('Missing authored V102 scene '+n);
 const p=Math.max(0,Math.min(1,progress));
 const scale=b.shotKind==='macro'?1.045:b.shotKind==='detail'?1.02:1;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden'}}>
   <g data-scene={b.sceneKey} data-action={b.actionId} data-family={b.family} data-bg={b.bgGroup} transform={'translate('+(960*(1-scale))+' '+(540*(1-scale))+') scale('+scale+')'}>{dispatch(b,p)}</g>
   <R x={0} y={0} w={1920} h={1080} c={C.night} o={.02}/>
 </svg>;
};
