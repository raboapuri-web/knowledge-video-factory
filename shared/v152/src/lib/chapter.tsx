// V146 考える夜「なぜ哺乳類は進化の過程を、非効率なセックスを残し続けたのか？」
// 章シーンの生成：12種レイアウトの汎用スライド描画 + 文単位の字幕 + 登場/退場エフェクト
// 注意：仕様書の見出し明朝指定は、CI でのフォント追加リスクを避けるため Noto Sans JP で統一している。
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {all, createRef, delay, waitFor} from '@motion-canvas/core';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';

const FONT = 'Noto Sans JP';
const C_PAPER = '#F1ECE0';
const C_RED = '#A52B40';
const C_TEAL = '#4B8F8A';
const C_GRAY = '#A5A09A';
const C_BG = '#111114';
const C_PANEL = '#1B1C22';
const C_LINE = '#363239';
const C_AXIS = '#454049';

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
        <Txt text={wrapJa(d[0] || '', 14)} fontFamily={FONT} fontSize={96} fontWeight={700} fill={C_BG} y={-60} />
        <Txt text={d[1] || ''} fontFamily={FONT} fontSize={36} fill={'#5a5a55'} y={160} />
      </>
    );
  }
  const chips = d.slice(1, 4);
  return (
    <>
      <Txt text={wrapJa(d[0] || '', 16)} fontFamily={FONT} fontSize={92} fontWeight={700} fill={C_PAPER} y={-170} />
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
      <Txt text={wrapJa(d[0] || '', 18)} fontFamily={FONT} fontSize={84} fontWeight={700} fill={C_PAPER} y={-90} />
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
  const labels = ['実際', '想像'];
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


function richBody(s: any) {
  const d: string[] = s.display || [];
  const textA = wrapJa(d[0] || '', 18, 2);
  const textB = wrapJa(d[1] || '', 18, 2);
  const label = (text: string, x: number, y: number, w = 660) => (
    <Rect width={w} height={154} x={x} y={y} fill={C_PANEL} stroke={C_LINE} lineWidth={2} radius={14}>
      <Txt text={wrapJa(text, 18, 2)} fontFamily={FONT} fontSize={42} fill={C_PAPER} />
    </Rect>
  );
  if (s.viz === 'numbers') return (
    <>
      <Txt text={'誰が覚えていると思うか？'} y={-275} fontFamily={FONT} fontSize={57} fill={C_PAPER} fontWeight={700} />
      <Rect width={810} height={86} x={-160} y={-85} fill={C_LINE} radius={9} />
      <Rect width={745} height={86} x={-192} y={-85} fill={C_RED} radius={9} />
      <Txt text={'46％ 予想'} fontSize={63} fontFamily={FONT} fill={C_PAPER} x={570} y={-84} fontWeight={700}/>
      <Rect width={810} height={86} x={-160} y={85} fill={C_LINE} radius={9} />
      <Rect width={374} height={86} x={-378} y={85} fill={C_TEAL} radius={9} />
      <Txt text={'23％ 実際'} fontSize={63} fontFamily={FONT} fill={C_PAPER} x={570} y={86} fontWeight={700}/>
      <Txt text={'自分への注目を、ほぼ2倍に見積もっていた'} y={245} fontFamily={FONT} fontSize={39} fill={C_GRAY}/>
    </>
  );
  if (s.viz === 'spotlight' || s.viz === 'stage') return (
    <>
      <Circle width={850} height={850} x={0} y={70} stroke={C_RED} lineWidth={3} opacity={0.13} />
      <Circle width={650} height={650} x={0} y={70} stroke={C_RED} lineWidth={5} opacity={0.28} />
      <Circle width={450} height={450} x={0} y={70} fill={C_PANEL} stroke={C_RED} lineWidth={5} />
      <Circle width={120} height={120} x={0} y={-55} fill={C_PAPER}/>
      <Rect width={170} height={190} x={0} y={130} fill={C_PAPER} radius={65}/>
      <Txt text={'見られているのは、誰か'} y={-312} fontFamily={FONT} fontSize={64} fontWeight={700} fill={C_PAPER} />
      <Txt text={textA} y={320} fontFamily={FONT} fontSize={39} fill={C_GRAY}/>
      <Txt text={'●    ●    ●    ●    ●    ●    ●'} y={398} fontFamily={FONT} fontSize={32} fill={C_TEAL} opacity={0.6}/>
    </>
  );
  if (s.viz === 'shirt') return (
    <>
      <Rect width={680} height={500} y={25} fill={C_PANEL} stroke={C_PAPER} lineWidth={4} radius={40}/>
      <Rect width={420} height={100} y={-260} fill={C_BG} stroke={C_PAPER} lineWidth={3} radius={36}/>
      <Txt text={'Tシャツ'} fontFamily={FONT} fontSize={69} fontWeight={700} fill={C_RED} y={-85}/>
      <Txt text={'バリー・マニロウ'} fontFamily={FONT} fontSize={51} fill={C_PAPER} y={35}/>
      <Txt text={'本人が感じる視線 ≠ 実際の記憶'} fontFamily={FONT} fontSize={46} fill={C_GRAY} y={348}/>
    </>
  );
  if (s.viz === 'audience' || s.viz === 'conference') return (
    <>
      <Txt text={s.viz === 'conference' ? '沈黙する会議' : '他人の頭の中は見えない'}
        fontSize={62} fill={C_PAPER} fontFamily={FONT} fontWeight={700} y={-325}/>
      {Array.from({length: 36}, (_, i) => (
        <Node key={'p'+i}>
          <Circle width={67} height={67} x={-665+(i%9)*166} y={-175+Math.floor(i/9)*118}
            fill={i%9===4 && Math.floor(i/9)===1 ? C_RED : C_PANEL} stroke={i%9===4 && Math.floor(i/9)===1?C_RED:C_TEAL} lineWidth={3}/>
          <Rect width={72} height={30} x={-665+(i%9)*166} y={-111+Math.floor(i/9)*118}
            fill={C_PANEL} radius={12} opacity={0.85}/>
        </Node>
      ))}
      <Txt text={textA} fontFamily={FONT} fontSize={46} fill={C_PAPER} y={340}/>
    </>
  );
  if (s.viz === 'courtroom') return (
    <>
      <Txt text={'頭の中の裁判'} fontFamily={FONT} fontSize={77} fontWeight={700} fill={C_RED} y={-305}/>
      {['検察官','証人','裁判官'].map((t,i)=>
        <Node key={'court'+i}>
          <Rect width={450} height={310} x={(i-1)*515} y={90} fill={C_PANEL} stroke={i===1?C_RED:C_GRAY} lineWidth={4} radius={18}/>
          <Circle width={86} height={86} x={(i-1)*515} y={-70} fill={C_PAPER}/>
          <Rect width={160} height={110} x={(i-1)*515} y={38} fill={C_PAPER} radius={36}/>
          <Txt text={t} x={(i-1)*515} y={174} fontFamily={FONT} fontSize={47} fontWeight={700} fill={C_PAPER}/>
        </Node>
      )}
      <Txt text={'全員、同じ自分。'} y={365} fontFamily={FONT} fontSize={55} fill={C_RED}/>
    </>
  );
  if (s.viz === 'verdict') return (
    <>
      <Rect width={950} height={510} fill={C_PANEL} stroke={C_RED} lineWidth={7} radius={20} rotation={-7}/>
      <Txt text={'有罪？'} fontSize={196} fontWeight={700} fill={C_RED} fontFamily={FONT} rotation={-7} y={-55}/>
      <Txt text={textA} fontSize={43} fontFamily={FONT} fill={C_PAPER} y={185}/>
      <Txt text={'裁判官まで、自分自身だ'} fontSize={41} fontFamily={FONT} fill={C_GRAY} y={356}/>
    </>
  );
  if (s.viz === 'memory') return (
    <>
      <Rect width={1000} height={600} x={-110} y={10} rotation={-7} fill={C_PANEL} stroke={C_LINE} lineWidth={4} radius={18}/>
      <Rect width={1000} height={600} x={50} y={-20} rotation={5} fill={C_PANEL} stroke={C_TEAL} lineWidth={4} radius={18}/>
      <Rect width={920} height={530} x={0} y={0} fill={C_BG} stroke={C_RED} lineWidth={5} radius={16}/>
      <Txt text={'MEMORY ≠ RECORD'} fontFamily={FONT} fontSize={49} fill={C_RED} y={-186}/>
      <Txt text={textA} fontFamily={FONT} fontSize={64} fontWeight={700} fill={C_PAPER} y={-40}/>
      <Txt text={textB} fontFamily={FONT} fontSize={41} fill={C_GRAY} y={123}/>
      <Txt text={'REC     ●'} fontFamily={FONT} fontSize={35} fill={C_RED} y={225}/>
    </>
  );
  if (s.viz === 'loop') return (
    <>
      <Circle width={705} height={705} stroke={C_TEAL} lineWidth={9} opacity={0.44}/>
      <Circle width={540} height={540} stroke={C_RED} lineWidth={8} opacity={0.75}/>
      <Circle width={370} height={370} fill={C_PANEL} stroke={C_PAPER} lineWidth={4}/>
      <Txt text={'反芻'} fontFamily={FONT} fontSize={106} fill={C_PAPER} fontWeight={700}/>
      <Txt text={'↻'} fontFamily={FONT} fontSize={155} x={520} y={0} fill={C_RED}/>
      <Txt text={'思い出す → 考える → また思い出す'} y={377} fontFamily={FONT} fontSize={47} fill={C_GRAY}/>
    </>
  );
  if (s.viz === 'clock') return (
    <>
      <Txt text={'二つの時間'} fontFamily={FONT} fontSize={86} fontWeight={700} y={-325} fill={C_PAPER}/>
      <Rect width={1460} height={125} y={-97} fill={C_PANEL} radius={16}/>
      <Rect width={1460} height={125} y={129} fill={C_PANEL} radius={16}/>
      <Line points={[[-520,-95],[-140,-95],[250,-95],[600,-95]]} stroke={C_TEAL} lineWidth={12}/>
      <Line points={[[-520,129],[-160,129],[270,129],[600,129]]} stroke={C_RED} lineWidth={12}/>
      <Txt text={'現実の時間'} x={-570} y={-185} fontFamily={FONT} fontSize={48} fill={C_TEAL}/>
      <Txt text={'頭の中の時間'} x={-545} y={38} fontFamily={FONT} fontSize={48} fill={C_RED}/>
      <Txt text={'過去は終わった。記憶は、再生される。'} y={337} fontFamily={FONT} fontSize={49} fill={C_PAPER}/>
    </>
  );
  if (s.viz === 'mirror' || s.viz === 'fork') return (
    <>
      <Txt text={s.viz === 'fork'?'反省 ≠ 反芻':'自分の視点 ≠ 他人の視点'} fontFamily={FONT} fontSize={71} fontWeight={700} fill={C_PAPER} y={-330}/>
      <Line points={[[0,-245],[0,290]]} stroke={C_LINE} lineWidth={5}/>
      {label(textA,-450,-20,770)}
      {label(textB,450,-20,770)}
      <Txt text={'≠'} fontFamily={FONT} fontSize={116} fill={C_RED} fontWeight={700} y={205}/>
    </>
  );
  if (s.viz === 'research') return (
    <>
      <Rect width={1450} height={570} fill={C_PANEL} stroke={C_TEAL} lineWidth={4} radius={15}/>
      <Txt text={'EVIDENCE / RESEARCH'} y={-280} fontFamily={FONT} fontSize={40} fill={C_TEAL}/>
      <Rect width={1450} height={6} y={-222} fill={C_RED}/>
      <Txt text={wrapJa(String(s.heading||''),21,2)} y={-94} fontFamily={FONT} fontSize={76} fill={C_PAPER} fontWeight={700}/>
      <Txt text={textA} y={110} fontFamily={FONT} fontSize={48} fill={C_GRAY}/>
      <Txt text={textB} y={200} fontFamily={FONT} fontSize={43} fill={C_RED}/>
    </>
  );
  if (s.viz === 'empty') return (
    <>
      <Rect width={1460} height={480} y={-20} fill={C_BG} stroke={C_LINE} lineWidth={4} radius={12}/>
      <Line points={[[-710,180],[710,180]]} stroke={C_RED} lineWidth={7}/>
      {Array.from({length:10},(_,i)=>(
        <Rect key={'seat'+i} width={105} height={67} x={-615+i*136} y={85} fill={C_PANEL} stroke={C_GRAY} lineWidth={2} radius={15} opacity={0.5}/>
      ))}
      <Txt text={'客席には、もう誰もいない。'} y={-238} fontFamily={FONT} fontSize={63} fill={C_PAPER} fontWeight={700}/>
      <Txt text={textA} y={330} fontFamily={FONT} fontSize={45} fill={C_GRAY}/>
    </>
  );
  return (
    <>
      <Txt text={textA} fontFamily={FONT} fontSize={78} fill={C_PAPER} fontWeight={700} y={-60}/>
      <Txt text={textB} fontFamily={FONT} fontSize={42} fill={C_GRAY} y={170}/>
    </>
  );
}

const dataTotal = 85;
function slideContent(s: any) {
  const dark48 = false;
  const headingFill = dark48 ? '#6b6560' : C_GRAY;
  const heading = (
    <>
      <Txt text={String(s.heading || '')} fontFamily={FONT} fontSize={30} fill={headingFill} textAlign={'left'} width={900} x={-430} y={-478} />
      <Txt text={s.id + ' / ' + String((dataTotal as any) || '??')} fontFamily={FONT} fontSize={28} fill={headingFill} textAlign={'right'} width={200} x={780} y={-478} />
      <Rect width={1760} height={2} y={-438} fill={dark48 ? '#d8d2c0' : C_LINE} />
    </>
  );
  let body: any = null;
  switch (s.viz) {
    case 'numbers': case 'spotlight': case 'stage': case 'shirt': case 'audience': case 'conference': case 'courtroom': case 'verdict': case 'memory': case 'loop': case 'clock': case 'mirror': case 'fork': case 'research': case 'empty': body = richBody(s); break;
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
    case 'rotate': return {opacity:0, rotation:-5, scale:0.96};
    case 'wipe': return {opacity:0, position:[0,110], scale:0.99};
    default: return {opacity: 0};
  }
}

function* entranceFlow(layer: any, effect: string) {
  const l = layer();
  if (effect === 'slide-left' || effect === 'slide-right' || effect === 'slide-up' || effect === 'wipe') {
    yield* all(l.position([0, 0], 0.5), l.opacity(1, 0.5));
  } else if (effect === 'rotate') {
    yield* all(l.rotation(0,0.75),l.scale(1,0.75),l.opacity(1,0.75));
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
          {slideContent(s)}
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
        delay(0.8, layer().scale(1.025, Math.max(0.5, dur-1.05))),
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
