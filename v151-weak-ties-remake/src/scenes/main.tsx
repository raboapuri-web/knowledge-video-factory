import '@fontsource/noto-serif-jp/700.css';
import {makeScene2D, Rect, Circle, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import slidePlanJson from '../../content/slide-plan.json';
import measuredTimingJson from '../../content/measured-timing.json';
import type {SlidePlanItem, MeasuredTiming} from '../types';

const slides: SlidePlanItem[] = slidePlanJson;
const timing: MeasuredTiming = measuredTimingJson;

const cream = '#F2EBDD';
const red = '#A7353A';
const teal = '#4F9297';
const muted = '#A9A6A0';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const index = createRef<Txt>();
  const accent = createRef<Rect>();
  const node1 = createRef<Circle>();
  const node2 = createRef<Circle>();
  const node3 = createRef<Circle>();
  const node4 = createRef<Circle>();
  const edge1 = createRef<Rect>();
  const edge2 = createRef<Rect>();
  const edge3 = createRef<Rect>();
  const edge4 = createRef<Rect>();
  const glow = createRef<Circle>();

  view.add(
    <>
      <Rect width={1920} height={1080} fill="#111114" />
      <Rect ref={accent} x={-870} y={0} width={8} height={760} fill={red} radius={4} />
      <Rect ref={edge1} x={-360} y={-130} width={470} height={3} fill={teal} opacity={0.12} />
      <Rect ref={edge2} x={250} y={-130} width={420} height={3} fill={teal} opacity={0.12} />
      <Rect ref={edge3} x={-360} y={150} width={470} height={3} fill={teal} opacity={0.12} />
      <Rect ref={edge4} x={250} y={150} width={420} height={3} fill={teal} opacity={0.12} />
      <Circle ref={node1} x={-600} y={-130} size={42} fill={red} opacity={0.15} />
      <Circle ref={node2} x={-120} y={-130} size={42} fill={teal} opacity={0.15} />
      <Circle ref={node3} x={350} y={-130} size={42} fill={teal} opacity={0.15} />
      <Circle ref={node4} x={770} y={150} size={42} fill={red} opacity={0.15} />
      <Circle ref={glow} x={0} y={0} size={210} stroke={red} lineWidth={2} fill={'#A7353A'} opacity={0} />
      <Txt ref={index} x={-780} y={-425} width={420} fontFamily="Noto Serif JP" fontSize={25} fill={muted} textAlign="left" />
      <Txt ref={title} x={0} y={-25} width={1540} fontFamily="Noto Serif JP" fontWeight={700} fontSize={76} fill={cream} textAlign="center" textWrap />
      <Txt ref={subtitle} x={0} y={390} width={1480} fontFamily="Noto Serif JP" fontSize={28} fill={muted} textAlign="center" textWrap />
      <Rect x={0} y={500} width={1920} height={2} fill="#37343A" opacity={0.8} />
      <Txt x={-780} y={535} width={500} fontFamily="Noto Serif JP" fontSize={22} fill={muted} textAlign="left">考える夜</Txt>
      <Txt x={780} y={535} width={500} fontFamily="Noto Serif JP" fontSize={22} fill={muted} textAlign="right">WEAK TIES / 1973</Txt>
    </>
  );

  const rows = timing.slides;
  if (rows.length !== slides.length) {
    throw new Error(`Slide timing count mismatch: plan=${slides.length}, timing=${rows.length}`);
  }

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const measured = rows[i];
    if (slide.id !== measured.id || measured.end <= measured.start) {
      throw new Error(`Invalid measured timing for slide ${slide.id}`);
    }
    const duration = measured.duration;
    const network = /network|cluster|bridge|link|nodes|job|connections|cross|loop|expand|support|venn|groups|repair|transfer|observer|cultivate/i.test(slide.visual);
    const number = /56|17|1973|percent|numeric/i.test(slide.headline + ' ' + slide.visual);

    title().text(slide.headline);
    title().fontSize(slide.headline.length > 24 ? 64 : 78);
    subtitle().text(slide.visual + '　／　' + slide.effect);
    index().text(String(slide.id).padStart(2, '0') + '　/　' + String(slides.length).padStart(2, '0'));
    accent().fill(i % 3 === 0 ? red : i % 3 === 1 ? teal : cream);
    glow().opacity(number ? 0.10 : 0);
    node1().opacity(network ? 0.95 : 0.12);
    node2().opacity(network ? 0.85 : 0.12);
    node3().opacity(network ? 0.85 : 0.12);
    node4().opacity(network ? 0.95 : 0.12);
    edge1().opacity(network ? 0.75 : 0.08);
    edge2().opacity(network ? 0.55 : 0.08);
    edge3().opacity(network ? 0.55 : 0.08);
    edge4().opacity(network ? 0.75 : 0.08);

    yield* all(
      title().opacity(1, 0.18),
      subtitle().opacity(1, 0.18),
      index().opacity(1, 0.18),
      glow().scale(number ? 1.08 : 0.8, 0.22)
    );
    yield* waitFor(Math.max(0, duration - 0.36));
    yield* all(
      title().opacity(0, 0.18),
      subtitle().opacity(0, 0.18),
      index().opacity(0, 0.18),
      glow().opacity(0, 0.18)
    );
  }
});