import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutCubic, waitFor} from '@motion-canvas/core';
import {BEATS} from '../content/beats';
import {TIMING} from '../generated/timing';

const P = {
  bg: '#0a0f19',
  card: '#151f30',
  panel: '#202d3e',
  paper: '#f5f1e8',
  muted: '#a9b5c4',
  red: '#e66363',
  gold: '#e6bc77',
  aqua: '#68c9b8',
  line: '#344457',
};
const FONT = 'Noto Sans JP';

export default makeScene2D(function* (view) {
  view.fill(P.bg);
  const slides = Array.from({length: 5}, () => createRef<Node>());
  const subtitle = createRef<Txt>();
  const progress = Array.from({length: 5}, () => createRef<Rect>());
  const accusation = createRef<Node>();
  const questionUnderline = createRef<Rect>();
  const povertyNumber = createRef<Node>();
  const povertyTrack = createRef<Rect>();
  const kenyaBarA = createRef<Rect>();
  const kenyaBarB = createRef<Rect>();
  const kenyaResult = createRef<Node>();
  const envGDP = createRef<Node>();
  const envAir = createRef<Node>();
  const envFoot = createRef<Node>();
  const finalThesis = createRef<Node>();
  const finalLine = createRef<Rect>();

  view.add(
    <>
      {/* All slides occupy the upper 82% of the frame. */}
      <Rect width={1920} height={1080} fill={P.bg} />
      <Rect x={-830} y={-460} width={8} height={38} radius={4} fill={P.red}/>
      <Txt x={-635} y={-463} text={'考える夜'} fontFamily={FONT}
        fill={P.paper} fontWeight={700} fontSize={36}/>
      <Txt x={650} y={-463} text={'ECONOMICS  /  SLIDE EXPERIMENT'} fontFamily={FONT}
        fill={P.muted} fontWeight={400} fontSize={22}/>
      <Line points={[[ -860,-420 ],[ 860,-420 ]]} lineWidth={2} stroke={P.line}/>
      {progress.map((r, i) => (
        <Rect key={String(i)} ref={r} x={485+i*91} y={-397}
          width={78} height={6} radius={3} fill={P.panel}/>
      ))}

      {/* 01: accusation / visual tension */}
      <Node ref={slides[0]} opacity={0} y={40}>
        <Txt x={-700} y={-307} text={'THE ACCUSATION'} fill={P.red}
          fontFamily={FONT} fontWeight={700} fontSize={29}/>
        <Txt x={-18} y={-160} text={'資本主義は'} fill={P.paper}
          fontFamily={FONT} fontWeight={700} fontSize={118}/>
        <Txt x={-18} y={-35} text={'人類の敵なのか？'} fill={P.paper}
          fontFamily={FONT} fontWeight={700} fontSize={112}/>
        <Rect ref={questionUnderline} x={-30} y={51} width={0} height={10} radius={5} fill={P.red}/>
        <Node ref={accusation} opacity={0}>
          {['格差', '搾取', '環境破壊'].map((label,i) => (
            <Node key={label} x={-460+i*460} y={216}>
              <Rect width={390} height={105} radius={16} fill={P.card} stroke={P.red} lineWidth={3}/>
              <Circle x={-145} width={20} height={20} fill={P.red}/>
              <Txt x={20} text={label} fontFamily={FONT} fontWeight={700}
                fontSize={54} fill={P.paper}/>
            </Node>
          ))}
        </Node>
      </Node>

      {/* 02: verified poverty observation, not a causal attribution */}
      <Node ref={slides[1]} opacity={0} y={40}>
        <Txt x={-640} y={-305} text={'01  /  POVERTY'} fill={P.aqua}
          fontFamily={FONT} fontWeight={700} fontSize={29}/>
        <Txt y={-220} text={'世界で極度の貧困を脱した人々'} fontFamily={FONT}
          fontWeight={700} fontSize={65} fill={P.paper}/>
        <Node ref={povertyNumber} opacity={0} scale={0.78}>
          <Txt x={-45} y={-45} text={'約15億人'} fontFamily={FONT}
            fontWeight={700} fontSize={172} fill={P.aqua}/>
          <Txt x={-10} y={75} text={'1990年  →  2022年'} fontFamily={FONT}
            fontWeight={700} fontSize={48} fill={P.muted}/>
        </Node>
        <Rect x={0} y={186} width={1310} height={32} radius={16} fill={P.panel}/>
        <Rect ref={povertyTrack} x={-610} y={186} width={0} height={32}
          radius={16} fill={P.aqua}/>
        <Txt y={263} text={'※ 市場制度だけの因果効果を示す数値ではない'} fontFamily={FONT}
          fontSize={30} fill={P.muted}/>
      </Node>

      {/* 03: experimental comparison, bars are relative height */}
      <Node ref={slides[2]} opacity={0} y={40}>
        <Txt x={-650} y={-307} text={'02  /  KENYA'} fill={P.gold}
          fontFamily={FONT} fontWeight={700} fontSize={29}/>
        <Txt y={-258} text={'現地の仕事が所得を変える'} fontFamily={FONT}
          fontWeight={700} fontSize={69} fill={P.paper}/>
        <Rect x={-375} y={35} width={630} height={420} radius={22}
          fill={P.card} stroke={P.line} lineWidth={3}/>
        <Rect x={375} y={35} width={630} height={420} radius={22}
          fill={P.card} stroke={P.line} lineWidth={3}/>
        <Txt x={-375} y={-113} text={'比較群'} fontFamily={FONT}
          fontWeight={700} fontSize={46} fill={P.muted}/>
        <Txt x={375} y={-113} text={'研修＋就職紹介'} fontFamily={FONT}
          fontWeight={700} fontSize={43} fill={P.paper}/>
        <Rect ref={kenyaBarA} x={-375} y={67} width={300} height={6}
          radius={12} fill={P.muted}/>
        <Rect ref={kenyaBarB} x={375} y={67} width={300} height={6}
          radius={12} fill={P.aqua}/>
        <Node ref={kenyaResult} opacity={0}>
          <Rect x={0} y={266} width={820} height={110} radius={22} fill={'#18362f'}
            stroke={P.aqua} lineWidth={3}/>
          <Txt y={263} text={'月収 +37%'} fontFamily={FONT} fontWeight={700}
            fontSize={80} fill={P.aqua}/>
        </Node>
        <Txt y={345} text={'J-PAL実験：若者1,115人  ※ GAFA単独の効果ではない'}
          fontFamily={FONT} fontSize={25} fill={P.muted}/>
      </Node>

      {/* 04: side-by-side trend; no misleading CO2 inference */}
      <Node ref={slides[3]} opacity={0} y={40}>
        <Txt x={-625} y={-305} text={'03  /  ENVIRONMENT'} fill={P.aqua}
          fontFamily={FONT} fontWeight={700} fontSize={29}/>
        <Txt y={-255} text={'成長と環境改善は両立できるか'} fontFamily={FONT}
          fontWeight={700} fontSize={69} fill={P.paper}/>
        <Node ref={envGDP} opacity={0} x={-398} y={45}>
          <Rect width={730} height={395} radius={27} fill={P.card} stroke={P.line} lineWidth={3}/>
          <Txt y={-121} text={'米国 実質GDP'} fontFamily={FONT} fontSize={48}
            fontWeight={700} fill={P.muted}/>
          <Txt y={19} text={'+338%'} fontFamily={FONT} fontSize={118}
            fontWeight={700} fill={P.gold}/>
          <Txt y={130} text={'経済規模の拡大'} fontFamily={FONT} fontSize={38} fill={P.paper}/>
        </Node>
        <Node ref={envAir} opacity={0} x={398} y={45}>
          <Rect width={730} height={395} radius={27} fill={P.card} stroke={P.line} lineWidth={3}/>
          <Txt y={-121} text={'主要大気汚染物質の排出'} fontFamily={FONT} fontSize={39}
            fontWeight={700} fill={P.muted}/>
          <Txt y={19} text={'−79%'} fontFamily={FONT} fontSize={118}
            fontWeight={700} fill={P.aqua}/>
          <Txt y={130} text={'大気汚染の改善'} fontFamily={FONT} fontSize={38} fill={P.paper}/>
        </Node>
        <Node ref={envFoot} opacity={0}>
          <Rect y={305} width={1220} height={69} radius={16} fill={P.panel}/>
          <Txt y={303} text={'1970〜2024年  /  EPA　※ CO₂排出量ではない'}
            fontFamily={FONT} fontSize={32} fill={P.paper}/>
        </Node>
      </Node>

      {/* 05: conclusion, visual statement instead of yet another card build */}
      <Node ref={slides[4]} opacity={0} y={40}>
        <Txt x={-710} y={-304} text={'CONCLUSION'} fontFamily={FONT}
          fontWeight={700} fontSize={30} fill={P.gold}/>
        <Txt y={-165} text={'資本主義は、完璧ではない。'} fontFamily={FONT}
          fontWeight={700} fontSize={80} fill={P.paper}/>
        <Node ref={finalThesis} opacity={0}>
          <Txt y={-15} text={'だが、比較する相手は'} fontFamily={FONT}
            fontWeight={700} fontSize={67} fill={P.paper}/>
          <Txt y={106} text={'存在しない理想郷ではない。'} fontFamily={FONT}
            fontWeight={700} fontSize={84} fill={P.aqua}/>
        </Node>
        <Rect ref={finalLine} y={193} width={0} height={12} radius={6} fill={P.aqua}/>
        <Txt y={280} text={'現実の代替案と比較して、何が人々の暮らしを改善するか。'} fontFamily={FONT}
          fontSize={38} fill={P.muted}/>
      </Node>

      {/* HARD GUARANTEE: subtitle layer is outside all slides and drawn last. */}
      <Rect x={0} y={454} width={1920} height={172} fill={'rgba(2,6,13,0.92)'}>
        <Rect y={-85} width={1920} height={3} fill={P.red}/>
        <Txt ref={subtitle} width={1730} textWrap textAlign={'center'}
          fontFamily={FONT} fontWeight={700} fontSize={40} lineHeight={59}
          fill={P.paper} text={BEATS[0].caption}/>
      </Rect>
    </>,
  );

  for (let i = 0; i < BEATS.length; i++) {
    subtitle().text(BEATS[i].caption);
    const d = TIMING[i];
    let used = 0;

    // Each slide is a persistent thought-space; change it only at semantic boundaries.
    if ([0, 3, 6, 9, 12].includes(i)) {
      const next = BEATS[i].slide;
      const previous = next - 1;
      progress.forEach((r, k) => r().fill(k <= next ? P.red : P.panel));
      if (previous >= 0) {
        yield* all(
          slides[previous]().opacity(0, 0.46),
          slides[previous]().y(-45, 0.46, easeInOutCubic),
          slides[next]().opacity(1, 0.46),
          slides[next]().y(0, 0.46, easeOutCubic),
        );
      } else {
        yield* all(slides[next]().opacity(1, 0.58), slides[next]().y(0, 0.58));
      }
      used += previous >= 0 ? 0.46 : 0.58;
    }

    if (i === 1) {
      yield* accusation().opacity(1, 0.6);
      used += 0.6;
    }
    if (i === 2) {
      yield* questionUnderline().width(1060, 0.75, easeOutCubic);
      used += 0.75;
    }
    if (i === 4) {
      yield* all(povertyNumber().opacity(1, 0.72), povertyNumber().scale(1, 0.72, easeOutCubic));
      used += 0.72;
    }
    if (i === 5) {
      yield* all(povertyTrack().width(1220, 0.85, easeInOutCubic), povertyTrack().x(0, 0.85, easeInOutCubic));
      used += 0.85;
    }
    if (i === 7) {
      yield* all(
        kenyaBarA().height(142, 1.1, easeOutCubic),
        kenyaBarB().height(195, 1.1, easeOutCubic),
      );
      used += 1.1;
    }
    if (i === 8) {
      yield* kenyaResult().opacity(1, 0.58);
      used += 0.58;
    }
    if (i === 10) {
      yield* all(
        envGDP().opacity(1, 0.7),
        envAir().opacity(1, 0.85),
      );
      used += 0.85;
    }
    if (i === 11) {
      yield* envFoot().opacity(1, 0.55);
      used += 0.55;
    }
    if (i === 13) {
      yield* finalThesis().opacity(1, 0.7);
      used += 0.7;
    }
    if (i === 14) {
      yield* finalLine().width(1210, 1.05, easeOutCubic);
      used += 1.05;
    }
    yield* waitFor(Math.max(0.15, d - used));
  }
});
