import chapter from '../../../chapters/07-update.json';
import timings from '../../generated/07-update';
import {makeProductionScene, type Chapter} from '../../production-scene';
const typed=chapter as Chapter;
const beat=typed.beats[1];
export default makeProductionScene({slug:typed.slug,title:typed.title,beats:[beat]},[timings[1]]);
