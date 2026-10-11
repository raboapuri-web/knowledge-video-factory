import {type View2D} from '@motion-canvas/2d';
import {type ThreadGenerator} from '@motion-canvas/core';
import {playPhysicalScene,type NarrativeScene} from './physicalDirector';

/**
 * V123 revision 3:
 * The previous universal six-phase movement renderer was removed completely.
 * Every scene now uses its authored physical location, props and actions.
 */
export function* playMeaningScene(view:View2D,scene:NarrativeScene):ThreadGenerator{
 yield* playPhysicalScene(view,scene);
}
