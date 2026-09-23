import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {ChapterFourFilm,chapterFourData} from './chapter4-preview-compositions';

if(chapterFourData.status!=='chapter_preview_ready'||chapterFourData.chapterId!=='chapter4'||
 chapterFourData.fps!==30||chapterFourData.durationFrames<1)
 throw Error('Chapter-four original narration and editorial timeline not prepared');
const Root=()=><Composition id='ToyokoChapterFourFeedback'
 component={ChapterFourFilm} fps={30} width={1920} height={1080}
 durationInFrames={chapterFourData.durationFrames}/>;
registerRoot(Root);
