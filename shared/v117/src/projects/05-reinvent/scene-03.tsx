import chapter from '../../../chapters/05-reinvent.json';
import timings from '../../generated/05-reinvent';
import {makeProductionScene,type Chapter} from '../../production-scene';
const typed=chapter as Chapter;const beat=typed.beats[3];
export default makeProductionScene({slug:typed.slug,title:typed.title,beats:[beat]},[timings[3]]);
