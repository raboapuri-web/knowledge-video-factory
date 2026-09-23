import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {ChapterTwoFilm,chapterTwoData} from './chapter2-preview-compositions';

if(chapterTwoData.status!=='chapter_preview_ready'||chapterTwoData.chapterId!=='chapter2'||
   chapterTwoData.fps!==30||chapterTwoData.durationFrames<1)
 throw Error('Original-audio chapter-two review timeline not prepared');
const Root=()=><Composition id='ToyokoChapterTwoFeedback'
 component={ChapterTwoFilm} fps={30} width={1920} height={1080}
 durationInFrames={chapterTwoData.durationFrames}/>;
registerRoot(Root);
