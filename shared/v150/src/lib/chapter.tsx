// V150 考える夜｜2026中間選挙・日本の最悪シナリオ
// 章シーンの生成：12種レイアウトの汎用スライド描画 + 文単位の字幕 + 登場/退場エフェクト
// 注意：仕様書の見出し明朝指定は、CI でのフォント追加リスクを避けるため Noto Sans JP で統一している。
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {all, createRef, delay, waitFor} from '@motion-canvas/core';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';

const FONT = 'Noto Sans JP';
const SERIF = 'Noto Serif CJK JP';
const C_PAPER = '#F1E9D9';
const C_RED = '#B2323C';
const C_TEAL = '#4B9A9C';
const C_GRAY = '#A4A9AE';
const C_BG = '#0E1015';
const C_PANEL = '#171C24';
const C_LINE = '#303743';
const C_AXIS = '#3a3f47';

// 日本語テキストを指定の行数以内に折り返す（文字数で分割する）。
function wrapJa(text: string, perLine: number, maxLines = 2): string {
  const s = String(text ?? '');
  if (s.length <= perLine) return s;
  const n = Math.min(perLine, Math.ceil(s.length / maxLines));
  const lines: string[] = [];
  for (let i = 0; i < s.length; i += n) lines.push(s.slice(i, i + n));
  return lines.slice(0, maxLines).join('\n');
}

function titleBody(s: any) {
  const d: string[] = s.display || [];
  if (false) {
    return (
      <>
        <Txt text={wrapJa(d[0] || '', 14)} fontFamily={SERIF} fontSize={96} fontWeight={700} fill={C_BG} y={-60} />
        <Txt text={d[1] || ''} fontFamily={FONT} fontSize={36} fill={'#5a5a55'} y={160} />
      </>
    );
  }
  const chips = d.slice(1, 4);
  return (
    <>
      <Txt text={wrapJa(d[0] || '', 16)} fontFamily={SERIF} fontSize={92} fontWeight={700} fill={C_PAPER} y={-170} />
      <Rect width={240} height={6} y={-10} fill={C_RED} />
      {chips.map((t: string, i: number) => (
        <Rect key={'k' + i} width={480} height={120} x={(i - 1) * 560} y={150} fill={C_PANEL} stroke={C_TEAL} lineWidth={3} radius={16}>
          <Txt text={t} fontFamily={FONT} fontSize={44} fill={C_PAPER} />
        </Rect>
      ))}
    </>
  );
}

function quoteBody(s: any) {
  const d: string[] = s.display || [];
  return (
    <>
      <Txt text={wrapJa(d[0] || '', 18)} fontFamily={SERIF} fontSize={84} fontWeight={700} fill={C_PAPER} y={-90} />
      {d[1] ? <Txt text={d[1]} fontFamily={FONT} fontSize={52} fill={C_TEAL} y={130} /> : null}
      {d[2] ? <Txt text={d[2]} fontFamily={FONT} fontSize={44} fill={C_GRAY} y={230} /> : null}
    </>
  );
}

function barsBody(s: any) {
  const d: string[] = s.display || [];
  const n = d.length;
  return (
    <>
      {d.map((t: string, i: number) => {
        const y = -150 + i * 130;
        const bw = 1080 * (i + 1) / n;
        return (
          <Node key={'k' + i}>
            <Txt text={wrapJa(t, 15)} fontFamily={FONT} fontSize={42} fill={C_PAPER} textAlign={'left'} width={640} x={-530} y={y} />
            <Rect width={bw} height={56} x={-180 + bw / 2} y={y} fill={i === n - 1 ? C_RED : C_TEAL} radius={10} />
          </Node>
        );
      })}
    </>
  );
}

function counterBody(s: any) {
  const d: string[] = s.display || [];
  if (d[0] && d[0].includes(' → ')) {
    const parts = d[0].split(' → ');
    const w = 300;
    const total = parts.length * w + (parts.length - 1) * 90;
    return (
      <>
        {parts.map((p: string, i: number) => {
          const cx = -total / 2 + w / 2 + i * (w + 90);
          return (
            <Node key={'k' + i}>
              <Rect width={w} height={220} x={cx} y={0} fill={C_PANEL} stroke={C_RED} lineWidth={4} radius={16}>
                <Txt text={p} fontFamily={FONT} fontSize={110} fontWeight={700} fill={C_PAPER} />
              </Rect>
              {i < parts.length - 1 ? <Txt text={'→'} fontFamily={FONT} fontSize={64} fill={C_GRAY} x={cx + w / 2 + 45} y={0} /> : null}
            </Node>
          );
        })}
      </>
    );
  }
  return (
    <>
      <Txt text={wrapJa(d[0] || '', 12)} fontFamily={FONT} fontSize={100} fontWeight={700} fill={C_PAPER} y={-40} />
      {d[1] ? (
        <Rect width={1100} height={110} y={200} fill={C_PANEL} radius={16}>
          <Txt text={d[1]} fontFamily={FONT} fontSize={44} fill={C_PAPER} />
        </Rect>
      ) : null}
    </>
  );
}

function linesBody(s: any) {
  const d: string[] = s.display || [];
  const labels = [d[1] || '可能性A', d[2] || '可能性B'];
  return (
    <>
      <Txt text={d[0] || ''} fontFamily={FONT} fontSize={s.id === '11' ? 72 : 64} fontWeight={700} fill={s.id === '11' ? C_RED : C_PAPER} y={-320} />
      <Rect width={1560} height={3} y={300} fill={C_AXIS} />
      <Line points={[[-700, 260], [-350, 205], [0, 160], [350, 120], [700, 90]]} stroke={C_TEAL} lineWidth={8} />
      <Line points={[[-700, 260], [-350, 170], [0, -10], [350, -150], [700, -280]]} stroke={C_RED} lineWidth={8} />
      <Txt text={labels[0]} fontFamily={FONT} fontSize={40} fill={C_TEAL} x={560} y={160} />
      <Txt text={labels[1]} fontFamily={FONT} fontSize={40} fill={C_RED} x={560} y={-250} />
    </>
  );
}

function ringsBody(s: any) {
  const d: string[] = s.display || [];
  return (
    <>
      <Circle width={660} height={660} x={0} y={-30} fill={C_BG} stroke={C_GRAY} lineWidth={6} />
      <Circle width={440} height={440} x={0} y={-30} fill={C_BG} stroke={C_TEAL} lineWidth={10} />
      <Txt text={wrapJa(d[0] || '', 7, 3)} fontFamily={FONT} fontSize={60} fontWeight={700} fill={C_PAPER} y={-30} />
      {d[1] ? <Txt text={d[1]} fontFamily={FONT} fontSize={44} fill={C_GRAY} y={330} /> : null}
    </>
  );
}

function flowBody(s: any) {
  const d: string[] = s.display || [];
  const rows = Math.ceil(d.length / 4);
  return (
    <>
      {d.map((t: string, i: number) => {
        const row = Math.floor(i / 4);
        const rowItems = d.slice(row * 4, row * 4 + 4);
        const w = Math.min(380, (1500 - (rowItems.length - 1) * 90) / rowItems.length);
        const total = rowItems.length * w + (rowItems.length - 1) * 90;
        const col = i % 4;
        const cx = -total / 2 + w / 2 + col * (w + 90);
        const y = (row - (rows - 1) / 2) * 260 - 20;
        return (
          <Node key={'k' + i}>
            <Rect width={w} height={150} x={cx} y={y} fill={C_PANEL} stroke={C_TEAL} lineWidth={3} radius={14}>
              <Txt text={wrapJa(t, Math.max(4, Math.floor((w - 36) / 40)))} fontFamily={FONT} fontSize={40} fill={C_PAPER} />
            </Rect>
            {col < rowItems.length - 1 ? <Txt text={'→'} fontFamily={FONT} fontSize={56} fill={C_TEAL} x={cx + w / 2 + 45} y={y} /> : null}
          </Node>
        );
      })}
    </>
  );
}

function tableBody(s: any) {
  const d: string[] = s.display || [];
  const n = d.length;
  return (
    <>
      {d.map((t: string, i: number) => {
        const y = -230 + i * 96;
        const last = i === n - 1;
        return (
          <Node key={'k' + i}>
            <Rect width={1240} height={74} x={0} y={y} fill={last && s.id === '04' ? C_RED : C_PANEL} radius={10} />
            <Txt text={t} fontFamily={FONT} fontSize={42} fontWeight={last && s.id === '04' ? 700 : 400} fill={C_PAPER} textAlign={'left'} width={1160} x={0} y={y} />
          </Node>
        );
      })}
    </>
  );
}

function twoColBody(s: any) {
  const d: string[] = s.display || [];
  const half = Math.ceil(d.length / 2);
  const left = d.slice(0, half);
  const right = d.slice(half);
  const col = (items: string[], cx: number) => (
    <Node>
      <Rect width={820} height={540} x={cx} y={0} fill={C_PANEL} radius={16} />
      {items.map((t: string, i: number) => (
        <Txt key={'k' + i} text={wrapJa(t, 17)} fontFamily={FONT} fontSize={42} fill={C_PAPER} x={cx} y={(i - (items.length - 1) / 2) * 110} />
      ))}
    </Node>
  );
  return (
    <>
      {col(left, -430)}
      {col(right, 430)}
    </>
  );
}

function cardsBody(s: any) {
  const d: string[] = s.display || [];
  if (d.length === 4 && d[3].endsWith('？')) {
    const cards = d.slice(0, 3);
    const w = 480;
    return (
      <>
        {cards.map((t: string, i: number) => (
          <Rect key={'k' + i} width={w} height={200} x={(i - 1) * (w + 36)} y={-80} fill={C_PANEL} radius={16}>
            <Txt text={wrapJa(t, 10)} fontFamily={FONT} fontSize={38} fill={C_PAPER} />
          </Rect>
        ))}
        <Txt text={d[3]} fontFamily={FONT} fontSize={56} fontWeight={700} fill={C_RED} y={220} />
      </>
    );
  }
  const perRow = 4;
  const rows = Math.max(1, Math.ceil(d.length / perRow));
  const w = d.length <= 2 ? 560 : 430;
  const h = 200;
  const gap = 36;
  return (
    <>
      {d.map((t: string, i: number) => {
        const row = Math.floor(i / perRow);
        const rowItems = d.slice(row * perRow, (row + 1) * perRow);
        const col = i % perRow;
        const x = (col - (rowItems.length - 1) / 2) * (w + gap);
        const y = (row - (rows - 1) / 2) * (h + gap);
        return (
          <Rect key={'k' + i} width={w} height={h} x={x} y={y} fill={C_PANEL} radius={16}>
            <Txt text={wrapJa(t, Math.floor((w - 40) / 38))} fontFamily={FONT} fontSize={38} fill={C_PAPER} />
          </Rect>
        );
      })}
    </>
  );
}

function diagramBody(s: any) {
  const d: string[] = s.display || [];
  if (d.length === 1) {
    return (
      <>
        <Txt text={wrapJa(d[0], 12)} fontFamily={FONT} fontSize={76} fontWeight={700} fill={C_PAPER} y={-40} />
        <Rect width={200} height={6} y={130} fill={C_RED} />
      </>
    );
  }
  const n = d.length;
  const spread = Math.min(1400, (n - 1) * 400);
  const centers = d.map((_: string, i: number) => (n === 1 ? 0 : -spread / 2 + (i * spread) / (n - 1)));
  return (
    <>
      <Line points={centers.map((x) => [x, 0])} stroke={C_AXIS} lineWidth={4} />
      {d.map((t: string, i: number) => (
        <Node key={'k' + i}>
          <Circle width={210} height={210} x={centers[i]} y={0} fill={C_PANEL} stroke={C_TEAL} lineWidth={4} />
          <Txt text={wrapJa(t, 6, 3)} fontFamily={FONT} fontSize={34} fill={C_PAPER} x={centers[i]} y={0} />
        </Node>
      ))}
    </>
  );
}


/**
 * Two bespoke, grounded editorial graphics. The slope of the first is
 * explicitly a symbolic line, not a time-series reconstruction.
 */
function crashVisual() {
 return (
  <>
   <Txt text={'11.06 / 東京市場'} fontFamily={FONT} fontSize={44} fill={C_GRAY} x={-500} y={-230} />
   <Txt text={'−5.96%'} fontFamily={SERIF} fontSize={170} fontWeight={700} fill={C_RED} x={-400} y={-40}/>
   <Txt text={'日経平均 57,434.77'} fontFamily={FONT} fontSize={44} fill={C_PAPER} x={-410} y={105}/>
   <Line points={[[80,-80],[205,-65],[320,-140],[430,-90],[540,5],[650,150],[780,230]]} lineWidth={12} stroke={C_RED}/>
   <Circle width={32} height={32} x={780} y={230} fill={C_RED}/>
   <Txt text={'概念図 / 実際の推移を再現したものではない'} fontFamily={FONT} fontSize={25} fill={C_GRAY} x={440} y={300}/>
  </>
 );
}
function defenseVisual(){
 return (
  <>
    <Txt text={'2026年度 防衛費'} fontFamily={FONT} fontSize={40} fill={C_GRAY} x={-580} y={-250}/>
    <Rect width={520} height={82} fill={C_TEAL} x={-350} y={-155} radius={12}/>
    <Txt text={'約9兆円'} fontFamily={SERIF} fontSize={68} fontWeight={700} fill={C_PAPER} x={350} y={-155}/>
    <Txt text={'GDP比3.5%に相当する額（仮定）'} fontFamily={FONT} fontSize={38} fill={C_GRAY} x={-460} y={30}/>
    <Rect width={1320} height={82} fill={C_RED} x={50} y={130} radius={12}/>
    <Txt text={'約24兆円'} fontFamily={SERIF} fontSize={66} fontWeight={700} fill={C_PAPER} x={450} y={240}/>
  </>
 );
}

function slideContent(s: any, total: number) {
  const dark48 = false;
  const headingFill = dark48 ? '#6b6560' : C_GRAY;
  const heading = (
    <>
      <Txt text={String(s.heading || '')} fontFamily={FONT} fontSize={30} fill={headingFill} textAlign={'left'} width={900} x={-430} y={-478} />
      <Txt text={s.id + ' / ' + total} fontFamily={FONT} fontSize={28} fill={headingFill} textAlign={'right'} width={200} x={780} y={-478} />
      <Rect width={1760} height={2} y={-438} fill={dark48 ? '#d8d2c0' : C_LINE} />
      <Rect width={s.scenario ? 170 : 116} height={40} x={580} y={-472} fill={s.scenario ? C_RED : C_TEAL} radius={7}>
        <Txt text={s.scenario ? '仮定シナリオ' : '事実・背景'} fontFamily={FONT} fontSize={22} fontWeight={700} fill={C_PAPER}/>
      </Rect>
    </>
  );
  let body: any = null;
  if(s.id==='001')body=crashVisual();
  else if(s.id==='045')body=defenseVisual();
  else switch (s.viz) {
    case 'title': body = titleBody(s); break;
    case 'quote': body = quoteBody(s); break;
    case 'bars': body = barsBody(s); break;
    case 'counter': body = counterBody(s); break;
    case 'lines': body = linesBody(s); break;
    case 'rings': body = ringsBody(s); break;
    case 'flow': body = flowBody(s); break;
    case 'table': body = tableBody(s); break;
    case 'twocol': body = twoColBody(s); break;
    case 'cards': body = cardsBody(s); break;
    case 'diagram': body = diagramBody(s); break;
    default: body = cardsBody(s);
  }
  if (dark48) {
    return (
      <>
        <Rect width={1920} height={1080} x={0} y={0} fill={C_PAPER} />
        {heading}
        {body}
      </>
    );
  }
  return (
    <>
      {heading}
      {body}
    </>
  );
}

function effectInit(effect: string): any {
  switch (effect) {
    case 'slide-left': return {opacity: 0, position: [-80, 0]};
    case 'slide-right': return {opacity: 0, position: [80, 0]};
    case 'slide-up': return {opacity: 0, position: [0, 60]};
    case 'zoom': return {opacity: 0, scale: 0.92};
    case 'stagger': return {opacity: 0, scale: 0.97};
    case 'pulse': return {opacity: 0, scale: 1.05};
    default: return {opacity: 0};
  }
}

function* entranceFlow(layer: any, effect: string) {
  const l = layer();
  if (effect === 'slide-left' || effect === 'slide-right' || effect === 'slide-up') {
    yield* all(l.position([0, 0], 0.5), l.opacity(1, 0.5));
  } else if (effect === 'zoom' || effect === 'stagger' || effect === 'pulse') {
    yield* all(l.scale(1, 0.5), l.opacity(1, 0.5));
  } else {
    yield* l.opacity(1, 0.5);
  }
}

export function createChapterScene(chapter: string, data: any, timing: any) {
  const slides: any[] = (data.slides || []).filter((s: any) => s.ch === chapter);
  const timed: any[] = (timing && timing.slides) || [];
  return makeScene2D(function* (view) {
    view.add(new Rect({width: 1920, height: 1080, fill: C_BG}));
    const layers = slides.map((s) => {
      const layer = createRef<Node>();
      view.add(
        <Node ref={layer} {...effectInit(s.effect || 'fade')}>
          {slideContent(s, data.meta.renderUnits || data.slides.length)}
        </Node>,
      );
      return {s, layer};
    });

    // 字幕は画面下部セーフエリアに最前面で固定する。
    const subLayer = createRef<Node>();
    const subTxt = createRef<Txt>();
    view.add(
      <Node ref={subLayer} opacity={0}>
        <Rect width={1560} height={116} y={438} fill={'#000000'} opacity={0.62} radius={18} />
        <Txt ref={subTxt} fontFamily={FONT} fontSize={36} fill={C_PAPER} width={1480} x={0} y={438} textAlign={'center'} />
      </Node>,
    );

    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      const t = timed[i] || {duration: 5, subs: []};
      const dur = Math.max(2, t.duration || 5);
      const subs: any[] = t.subs || [];
      const layer = layers[i].layer;
      yield* all(
        entranceFlow(layer, s.effect || 'fade'),
        delay(Math.max(0, dur - 0.35), layer().opacity(0, 0.35)),
        (function* () {
          let cursor = 0;
          for (const sub of subs) {
            const start = sub.start ?? 0;
            const w = start - cursor;
            if (w > 0) yield* waitFor(w);
            subTxt().text(wrapJa(sub.text || '', 34));
            subLayer().opacity(1);
            cursor = start;
            const d = sub.duration ?? 1;
            if (d > 0) yield* waitFor(d);
            cursor += d;
          }
          if (dur - cursor > 0) yield* waitFor(dur - cursor);
          subTxt().text('');
          subLayer().opacity(0);
        })(),
      );
    }
  });
}
