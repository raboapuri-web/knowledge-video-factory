import chapter from '../../../chapters/07-epilogue.json';
import timings from '../../generated/07-epilogue';
import {makeProductionScene,type Chapter} from '../../production-scene';
const typed=chapter as Chapter;const beat=typed.beats[0];
export default makeProductionScene({slug:typed.slug,title:typed.title,beats:[beat]},[timings[0]]);
