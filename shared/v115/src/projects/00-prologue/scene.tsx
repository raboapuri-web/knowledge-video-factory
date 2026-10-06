import plan from '../../../production-plan.json';
import timings from '../../generated/00-prologue';
import {makeProductionScene, type Chapter} from '../../production-scene';

const chapter=(plan.chapters as Chapter[]).find(c=>c.slug==='00-prologue');
if(!chapter) throw new Error('Missing chapter 00-prologue');

export default makeProductionScene(chapter,timings);
