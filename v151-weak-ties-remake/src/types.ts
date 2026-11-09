export interface SlidePlanItem {
  id: number;
  paragraphStart: number;
  paragraphEnd: number;
  headline: string;
  visual: string;
  effect: string;
  timing: string;
}

export interface ParagraphTiming {
  id: number;
  text: string;
  start: number;
  end: number;
  duration: number;
  cueIds: number[];
}

export interface CueTiming {
  id: number;
  paragraph: number;
  text: string;
  file: string;
  duration: number;
  start: number;
  end: number;
}

export interface MeasuredSlideTiming {
  id: number;
  start: number;
  end: number;
  duration: number;
}

/**
 * Exact runtime schema emitted by scripts/synthesize.mjs.
 * Slide copy/layout lives in slide-plan.json; this file stores measured timing only.
 */
export interface MeasuredTiming {
  speaker: number;
  speed: number;
  paragraphCount: number;
  cueCount: number;
  slideCount: number;
  duration: number;
  paragraphs: ParagraphTiming[];
  cues: CueTiming[];
  slides: MeasuredSlideTiming[];
}
