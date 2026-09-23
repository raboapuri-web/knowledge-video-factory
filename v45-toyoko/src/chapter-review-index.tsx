import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {StandaloneFilm,chapterPreviewData} from './chapter-preview-compositions';

if(chapterPreviewData.status!=='chapter_preview_ready'||chapterPreviewData.durationFrames<1)
 throw Error('The individual chapter must have approved, source-aligned video and original audio');
const Root=()=><Composition id='ToyokoChapterPreview' component={StandaloneFilm}
 width={1920} height={1080} fps={30}
 durationInFrames={chapterPreviewData.durationFrames}/>;
registerRoot(Root);
