import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {ChapterOnePreviewFilm,chapterOneData} from './chapter1-preview-compositions';

if(chapterOneData.status!=='chapter_preview_ready'||chapterOneData.chapterId!=='chapter1'||
 chapterOneData.durationFrames<1)
 throw Error('First chapter original-narration preview manifest was not built');
const Root=()=><Composition id='ToyokoChapter1Feedback'
 component={ChapterOnePreviewFilm} fps={30}
 width={1920} height={1080} durationInFrames={chapterOneData.durationFrames}/>;
registerRoot(Root);
