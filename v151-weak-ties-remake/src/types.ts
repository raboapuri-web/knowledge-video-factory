export interface SlidePlanItem {
  id: number;
  paragraphStart: number;
  paragraphEnd: number;
  headline: string;
  visual: string;
  effect: string;
  timing: string;
}

export interface MeasuredSlideTiming {
  id: number;
  start: number;
  end: number;
  duration: number;
}

export interface MeasuredTiming {
  speaker: number;
  speed: number;
  paragraphCount: number;
  cueCount: number;
  slideCount: number;
  duration: number;
  paragraphs: Array<{
    id: number;
    text: string;
    start: number;
    end: number;
    duration: number;
    cueIds: number[];
  }>;
  cues: Array<{
    id: number;
    paragraph: number;
    text: string;
    file: string;
    duration: number;
    start: number;
    end: number;
  }>;
  slides: MeasuredSlideTiming[];
}
