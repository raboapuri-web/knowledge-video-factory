import plan from '../../../production-plan.json';
import timings from '../../generated/01-evaluation';
import {makeProductionScene, type Chapter} from '../../production-scene';

const chapter=(plan.chapters as Chapter[]).find(c=>c.slug==='01-evaluation');
if(!chapter) throw new Error('Missing chapter 01-evaluation');

export default makeProductionScene(chapter,timings);
