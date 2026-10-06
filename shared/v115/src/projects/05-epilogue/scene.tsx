import plan from '../../../production-plan.json';
import timings from '../../generated/05-epilogue';
import {makeProductionScene, type Chapter} from '../../production-scene';

const chapter=(plan.chapters as Chapter[]).find(c=>c.slug==='05-epilogue');
if(!chapter) throw new Error('Missing chapter 05-epilogue');

export default makeProductionScene(chapter,timings);
