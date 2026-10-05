import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {BEATS} from '../content/beats';
import {TIMING} from '../generated/timing';

const C = {
  bg: '#08131b',
  panel: '#132630',
  panel2: '#1d3440',
  paper: '#f1ece2',
  gray: '#7c858b',
  blue: '#5d7f96',
  teal: '#70a097',
  gold: '#c8a15d',
  red: '#aa5754',
  ink: '#15232c',
};

const font = 'Noto Sans JP';

export default makeScene2D(function* (view) {
  view.fill(C.bg);

  const chapter = createRef<Txt>();
  const clock = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const sato = createRef<Node>();
  const boss = createRef<Node>();
  const folder = createRef<Rect>();
  const colleagueA = createRef<Node>();
  const colleagueB = createRef<Node>();
  const colleagueC = createRef<Node>();
  const sideWorker = createRef<Node>();
  const splitLine = createRef<Line>();
  const formula = createRef<Node>();
  const monthLabel = createRef<Txt>();

  const taskCards = Array.from({length: 10}, () => createRef<Rect>());
  const trustNodes = Array.from({length: 3}, () => createRef<Node>());
  const abilityCards = Array.from({length: 4}, () => createRef<Node>());

  const person = (
    ref: ReturnType<typeof createRef<Node>>,
    x: number,
    y: number,
    shirt: string,
    scale = 1,
  ) => (
    <Node ref={ref} x={x} y={y} scale={scale}>
      <Circle width={82} height={82} y={-92} fill={'#d8b79c'} />
      <Rect width={116} height={150} radius={26} fill={shirt} />
      <Line
        points={[
          [-18, -44],
          [0, 5],
          [18, -44],
        ]}
        stroke={C.red}
        lineWidth={13}
        closed
      />
      <Rect width={32} height={104} x={-38} y={122} radius={14} fill={'#39464f'} />
      <Rect width={32} height={104} x={38} y={122} radius={14} fill={'#39464f'} />
    </Node>
  );

  view.add(
    <>
      <Rect width={1780} height={850} radius={36} fill={C.panel} />
      <Rect x={0} y={-320} width={1600} height={150} radius={24} fill={C.panel2}>
        <Txt
          ref={chapter}
          text={'仕事ができる人への「ご褒美」'}
          fontFamily={font}
          fontWeight={700}
          fontSize={62}
          fill={C.paper}
        />
      </Rect>

      {/* windows / office depth */}
      {[-650, -390, -130, 130, 390, 650].map((x, i) => (
        <Rect
          key={x}
          x={x}
          y={-115}
          width={190}
          height={210}
          radius={16}
          fill={i % 2 === 0 ? '#183542' : '#1a3b49'}
          stroke={'#3f5966'}
          lineWidth={5}
        >
          <Rect
            width={52}
            height={75 + (i % 3) * 18}
            y={55}
            fill={i % 2 === 0 ? C.gold : C.blue}
            opacity={0.38}
          />
        </Rect>
      ))}

      {/* desks */}
      {[-600, -180, 260, 630].map(x => (
        <Node key={x} x={x} y={285}>
          <Rect width={330} height={28} radius={8} fill={'#765f50'} />
          <Rect x={-125} y={90} width={24} height={180} fill={'#4d4037'} />
          <Rect x={125} y={90} width={24} height={180} fill={'#4d4037'} />
          <Rect y={-78} width={190} height={112} radius={12} fill={'#1a252d'} stroke={C.gray} lineWidth={5} />
        </Node>
      ))}

      {person(colleagueA, -600, 145, '#657987', 0.82)}
      {person(colleagueB, -180, 145, '#596d7a', 0.82)}
      {person(sato, 260, 145, '#e6e2da', 0.92)}
      {person(colleagueC, 630, 145, '#66747d', 0.82)}

      <Node ref={boss} x={-1080} y={100} opacity={0}>
        <Circle width={86} height={86} y={-94} fill={'#d8b79c'} />
        <Rect width={122} height={160} radius={26} fill={'#2f424e'} />
        <Rect width={36} height={110} x={-40} y={126} radius={12} fill={'#2a343b'} />
        <Rect width={36} height={110} x={40} y={126} radius={12} fill={'#2a343b'} />
      </Node>

      <Rect
        ref={folder}
        x={-760}
        y={120}
        width={210}
        height={142}
        radius={15}
        fill={C.red}
        opacity={0}
        rotation={-8}
      >
        <Rect y={-52} x={-45} width={90} height={24} radius={6} fill={'#cf7772'} />
        <Line
          points={[
            [-70, -12],
            [65, -12],
          ]}
          stroke={C.paper}
          lineWidth={7}
          opacity={0.7}
        />
        <Line
          points={[
            [-70, 20],
            [35, 20],
          ]}
          stroke={C.paper}
          lineWidth={7}
          opacity={0.7}
        />
      </Rect>

      <Txt
        ref={clock}
        x={700}
        y={-315}
        text={'17:40'}
        fontFamily={font}
        fontWeight={700}
        fontSize={62}
        fill={C.gold}
      />

      {taskCards.map((ref, i) => (
        <Rect
          key={i}
          ref={ref}
          x={390 + (i % 3) * 32}
          y={250 - i * 28}
          width={250}
          height={80}
          radius={12}
          fill={i >= 7 ? C.red : i % 2 === 0 ? C.paper : '#b7c0c3'}
          stroke={'#52616a'}
          lineWidth={4}
          opacity={0}
        />
      ))}

      {['期限厳守', '返信が早い', 'ミスに気づく', '助ける'].map((label, i) => (
        <Node
          key={label}
          ref={abilityCards[i]}
          x={-530 + i * 345}
          y={-30 + (i % 2) * 80}
          opacity={0}
          scale={0.8}
        >
          <Rect width={280} height={92} radius={22} fill={'#18313c'} stroke={C.teal} lineWidth={5} />
          <Circle x={-100} width={36} height={36} fill={C.teal} />
          <Txt
            x={35}
            text={label}
            fontFamily={font}
            fontWeight={700}
            fontSize={34}
            fill={C.paper}
          />
        </Node>
      ))}

      {['任せられる', '間違えない', '断らない'].map((label, i) => (
        <Node
          key={label}
          ref={trustNodes[i]}
          x={-430 + i * 430}
          y={-45}
          opacity={0}
          scale={0.7}
        >
          <Rect width={340} height={105} radius={28} fill={i === 2 ? '#3a272a' : '#173540'} stroke={i === 2 ? C.red : C.gold} lineWidth={6} />
          <Txt
            text={label}
            fontFamily={font}
            fontWeight={700}
            fontSize={38}
            fill={i === 2 ? '#f0cac7' : C.paper}
          />
        </Node>
      ))}

      <Txt
        ref={monthLabel}
        x={-600}
        y={-10}
        text={'翌月'}
        fontFamily={font}
        fontWeight={700}
        fontSize={52}
        fill={C.gold}
        opacity={0}
      />

      <Line
        ref={splitLine}
        points={[
          [0, -190],
          [0, 360],
        ]}
        stroke={C.paper}
        lineWidth={5}
        opacity={0}
      />

      <Node ref={sideWorker} x={-430} y={130} opacity={0}>
        <Circle width={82} height={82} y={-92} fill={'#d8b79c'} />
        <Rect width={116} height={150} radius={26} fill={'#66747d'} />
        <Txt
          y={190}
          text={'頼みにくい'}
          fontFamily={font}
          fontWeight={700}
          fontSize={36}
          fill={C.gray}
        />
        <Txt
          x={135}
          y={-110}
          text={'×'}
          fontFamily={font}
          fontWeight={700}
          fontSize={76}
          fill={C.red}
        />
      </Node>

      <Node ref={formula} opacity={0} scale={0.86}>
        <Rect width={1560} height={440} radius={40} fill={'#0d1d26'} stroke={C.red} lineWidth={8} />
        <Txt
          y={-95}
          text={'仕事ができる'}
          fontFamily={font}
          fontWeight={700}
          fontSize={76}
          fill={C.paper}
        />
        <Txt
          y={20}
          text={'↓'}
          fontFamily={font}
          fontWeight={700}
          fontSize={68}
          fill={C.gold}
        />
        <Txt
          y={135}
          text={'「報酬」＝ 次の仕事'}
          fontFamily={font}
          fontWeight={700}
          fontSize={88}
          fill={C.paper}
        />
        <Rect x={380} y={135} width={385} height={122} radius={18} fill={C.red} opacity={0.22} />
      </Node>

      <Rect
        y={452}
        width={1760}
        height={132}
        radius={22}
        fill={'rgba(0,0,0,0.76)'}
      >
        <Txt
          ref={subtitle}
          width={1610}
          text={BEATS[0].caption}
          textWrap
          textAlign={'center'}
          fontFamily={font}
          fontWeight={700}
          fontSize={39}
          fill={C.paper}
          lineHeight={55}
        />
      </Rect>
    </>,
  );

  const hold = function* (seconds: number, used: number) {
    yield* waitFor(Math.max(0.08, seconds - used));
  };

  // Beat 1: office begins to empty while Sato remains.
  subtitle().text(BEATS[0].caption);
  {
    const d = TIMING[0];
    const m = Math.min(1.25, d * 0.24);
    yield* all(
      colleagueA().x(-1050, m, easeInOutCubic),
      colleagueB().x(-900, m, easeInOutCubic),
      colleagueC().x(1050, m, easeInOutCubic),
      sato().scale(1.02, m, easeOutCubic),
      clock().fill(C.paper, m),
    );
    yield* hold(d, m);
  }

  // Beat 2: competence appears around Sato, not as static labels but as arriving proof cards.
  subtitle().text(BEATS[1].caption);
  {
    const d = TIMING[1];
    const m = Math.min(1.5, d * 0.35);
    yield* sequence(
      0.16,
      ...abilityCards.map((ref, i) =>
        all(
          ref().opacity(1, 0.38),
          ref().scale(1, 0.38, easeOutCubic),
          ref().y(ref().y() - (i % 2 === 0 ? 28 : -22), 0.38),
        ),
      ),
    );
    yield* hold(d, m);
    yield* all(...abilityCards.map(ref => ref().opacity(0, 0.32)));
  }

  // Beat 3: boss enters and physically transfers a red folder.
  subtitle().text(BEATS[2].caption);
  {
    const d = TIMING[2];
    const m = Math.min(1.55, d * 0.30);
    yield* all(
      boss().opacity(1, 0.35),
      boss().x(-350, m, easeOutCubic),
      folder().opacity(1, 0.25),
      folder().x(360, m, easeInOutCubic),
      folder().y(208, m, easeInOutCubic),
      folder().rotation(4, m),
    );
    yield* hold(d, m);
  }

  // Beat 4: 17:45, Sato accepts and the first workload layer appears.
  subtitle().text(BEATS[3].caption);
  {
    const d = TIMING[3];
    const m = Math.min(1.3, d * 0.24);
    clock().text('17:45');
    clock().fill(C.red);
    yield* all(
      sato().rotation(3, 0.32).to(-2, 0.32).to(0, 0.25),
      taskCards[0]().opacity(1, 0.45),
      taskCards[0]().x(410, 0.45),
      boss().opacity(0.42, m),
    );
    yield* hold(d, m);
  }

  // Beat 5: same background; time advances and work accumulates.
  subtitle().text(BEATS[4].caption);
  {
    const d = TIMING[4];
    const step = Math.min(0.65, d / 8);
    for (const [index, label] of ['19:00', '20:00', '21:00'].entries()) {
      clock().text(label);
      yield* all(
        taskCards[index + 1]().opacity(1, step),
        taskCards[index + 1]().y(220 - (index + 1) * 28, step),
        sato().y(150 + index * 10, step),
      );
      yield* waitFor(step * 0.45);
    }
    yield* hold(d, step * 4.35);
  }

  // Beat 6: trust becomes a visible funnel into one person.
  subtitle().text(BEATS[5].caption);
  {
    const d = TIMING[5];
    const m = Math.min(1.55, d * 0.32);
    yield* sequence(
      0.18,
      ...trustNodes.map(ref =>
        all(ref().opacity(1, 0.42), ref().scale(1, 0.42, easeOutCubic)),
      ),
    );
    yield* all(
      taskCards[4]().opacity(1, 0.35),
      taskCards[5]().opacity(1, 0.45),
      taskCards[6]().opacity(1, 0.55),
    );
    yield* hold(d, m);
    yield* all(...trustNodes.map(ref => ref().opacity(0, 0.3)));
  }

  // Beat 7: months advance, task stack grows without changing the office background.
  subtitle().text(BEATS[6].caption);
  {
    const d = TIMING[6];
    const m = Math.min(1.7, d * 0.34);
    monthLabel().opacity(1);
    yield* sequence(
      0.17,
      taskCards[7]().opacity(1, 0.45),
      taskCards[8]().opacity(1, 0.45),
      taskCards[9]().opacity(1, 0.45),
    );
    monthLabel().text('その翌月');
    yield* monthLabel().x(-480, 0.45, easeOutCubic);
    yield* hold(d, m);
  }

  // Beat 8: compare with a worker whom people avoid asking.
  subtitle().text(BEATS[7].caption);
  {
    const d = TIMING[7];
    const m = Math.min(1.35, d * 0.28);
    yield* all(
      splitLine().opacity(0.62, 0.4),
      sideWorker().opacity(1, 0.45),
      sideWorker().x(-500, m, easeOutCubic),
      sato().x(490, m, easeInOutCubic),
      boss().opacity(0, 0.4),
      folder().opacity(0, 0.4),
    );
    yield* hold(d, m);
  }

  // Beat 9: clear the office details and land the paradox as the final visual statement.
  subtitle().text(BEATS[8].caption);
  {
    const d = TIMING[8];
    const m = Math.min(1.4, d * 0.24);
    yield* all(
      formula().opacity(1, m),
      formula().scale(1, m, easeOutCubic),
      sato().opacity(0.08, m),
      sideWorker().opacity(0.08, m),
      splitLine().opacity(0, m),
      ...taskCards.map(ref => ref().opacity(0.08, m)),
      monthLabel().opacity(0, m),
    );
    yield* hold(d, m);
  }
});
