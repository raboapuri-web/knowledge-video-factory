import plan from '../../../production-plan.json';
import timings from '../../generated/02-likability';
import {makeProductionScene, type Chapter} from '../../production-scene';

const chapter=(plan.chapters as Chapter[]).find(c=>c.slug==='02-likability');
if(!chapter) throw new Error('Missing chapter 02-likability');

export default makeProductionScene(chapter,timings);
