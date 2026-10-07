import chapter from '../../../chapters/06-realself.json';
import timings from '../../generated/06-realself';
import {makeProductionScene, type Chapter} from '../../production-scene';

const typed=chapter as Chapter;
const beat=typed.beats[2];
export default makeProductionScene(
  {slug:typed.slug,title:typed.title,beats:[beat]},
  [timings[2]],
);
