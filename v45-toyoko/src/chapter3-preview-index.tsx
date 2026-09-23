import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {ChapterThreeFilm,chapterThreeData} from './chapter3-preview-compositions';

if(chapterThreeData.status!=='chapter_preview_ready'||chapterThreeData.chapterId!=='chapter3'||
 chapterThreeData.fps!==30||chapterThreeData.durationFrames<1)
 throw Error('Approved-original chapter-three narration and 61 edited visuals are not staged');
const Root=()=><Composition id='ToyokoChapterThreeFeedback'
 component={ChapterThreeFilm} fps={30} width={1920} height={1080}
 durationInFrames={chapterThreeData.durationFrames}/>;
registerRoot(Root);
