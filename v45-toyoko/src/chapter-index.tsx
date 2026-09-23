import React from 'react';
import {Composition,registerRoot} from 'remotion';
import chapterJson from './chapter-review-data.json';
import {ChapterFilm,type ChapterData} from './video-compositions';

const chapter=chapterJson as ChapterData;
if(chapter.status!=='voicevox_measured_approved_script'||!Number.isFinite(chapter.durationFrames)||chapter.durationFrames<1)
 throw Error('Generate VOICEVOX and chapter-review-data.json before the chapter render');
const Root=()=><Composition
 id='ToyokoChapterComplete' component={ChapterFilm}
 defaultProps={{data:chapter}} width={1920} height={1080}
 fps={30} durationInFrames={chapter.durationFrames}/>;
registerRoot(Root);
