import chapter from '../../../chapters/01-sacred.json';
import timings from '../../generated/01-sacred';
import {makeProductionScene,type Chapter} from '../../production-scene';
const typed=chapter as Chapter;const beat=typed.beats[3];
export default makeProductionScene({slug:typed.slug,title:typed.title,beats:[beat]},[timings[3]]);
