import chapter from '../../../chapters/02-discovered.json';
import timings from '../../generated/02-discovered';
import {makeProductionScene, type Chapter} from '../../production-scene';

const typed=chapter as Chapter;
const beat=typed.beats[4];
export default makeProductionScene(
  {slug:typed.slug,title:typed.title,beats:[beat]},
  [timings[4]],
);
