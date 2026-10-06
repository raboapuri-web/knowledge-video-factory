import plan from '../../../production-plan.json';
import timings from '../../generated/03-politics';
import {makeProductionScene, type Chapter} from '../../production-scene';

const chapter=(plan.chapters as Chapter[]).find(c=>c.slug==='03-politics');
if(!chapter) throw new Error('Missing chapter 03-politics');

export default makeProductionScene(chapter,timings);
