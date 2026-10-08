import chapter from '../../../chapters/00-prologue.json';
import timings from '../../generated/00-prologue';
import {makeProductionScene,type Chapter} from '../../production-scene';
const typed=chapter as Chapter;const beat=typed.beats[2];
export default makeProductionScene({slug:typed.slug,title:typed.title,beats:[beat]},[timings[2]]);
