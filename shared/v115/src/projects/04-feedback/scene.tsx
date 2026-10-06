import plan from '../../../production-plan.json';
import timings from '../../generated/04-feedback';
import {makeProductionScene, type Chapter} from '../../production-scene';

const chapter=(plan.chapters as Chapter[]).find(c=>c.slug==='04-feedback');
if(!chapter) throw new Error('Missing chapter 04-feedback');

export default makeProductionScene(chapter,timings);
