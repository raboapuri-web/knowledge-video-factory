import React from 'react';
import {Composition,registerRoot} from 'remotion';
import filmData from './topic-film-data.json';
import {CompleteTopicFilm,type TopicMovie} from './topic-compositions';

const film=filmData as unknown as TopicMovie;
if(film.status!=='topic_visual_edit_render_ready'||film.durationFrames<1)
 throw Error('Generate verified 25-block topic-film-data.json before rendering');
const Root=()=><Composition id='ToyokoTopicReedit'
 component={CompleteTopicFilm} defaultProps={{data:film}}
 fps={30} width={1920} height={1080} durationInFrames={film.durationFrames}/>;
registerRoot(Root);
