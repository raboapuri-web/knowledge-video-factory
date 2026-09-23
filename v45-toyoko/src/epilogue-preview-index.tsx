import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {EpilogueFilm,epilogueData} from './epilogue-preview-compositions';
if(epilogueData.status!=='chapter_preview_ready'||epilogueData.chapterId!=='epilogue'||epilogueData.durationFrames<=0)
 throw Error('Original VOICEVOX epilogue data is missing');
const Root=()=><Composition id='ToyokoEpilogueFeedback' component={EpilogueFilm}
  fps={30} width={1920} height={1080} durationInFrames={epilogueData.durationFrames}/>;
registerRoot(Root);
