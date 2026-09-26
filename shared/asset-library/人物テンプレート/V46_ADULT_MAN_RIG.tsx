import React from 'react';
import {OfficeWorkerRig,OfficeWorkerRigProps} from './office-worker-rig';

/**
 * V46 Chapter2 recurring protagonist.
 * Derived from the approved office-worker rig, with a no-tie office-casual wardrobe.
 * Joint behavior remains identical so existing animation poses stay stable.
 */
export type V46AdultManRigProps=OfficeWorkerRigProps;

export const V46_ADULT_MAN_RIG=(props:V46AdultManRigProps)=>{
  return <OfficeWorkerRig
    suitColor="#313b4b"
    pantsColor="#4a4b4f"
    shirtColor="#f1efe9"
    shoeColor="#211f21"
    hairColor="#20242c"
    tieVisible={false}
    {...props}
  />;
};
