import chapter from '../../../chapters/04-compatibility.json';
import timings from '../../generated/04-compatibility';
import {makeProductionScene, type Chapter} from '../../production-scene';
const typed=chapter as Chapter;
const beat=typed.beats[0];
export default makeProductionScene({slug:typed.slug,title:typed.title,beats:[beat]},[timings[0]]);
