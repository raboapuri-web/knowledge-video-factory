import chapter from '../../../chapters/03-success.json';
import timings from '../../generated/03-success';
import {makeProductionScene, type Chapter} from '../../production-scene';

const typed=chapter as Chapter;
const beat=typed.beats[2];
export default makeProductionScene(
  {slug:typed.slug,title:typed.title,beats:[beat]},
  [timings[2]],
);
