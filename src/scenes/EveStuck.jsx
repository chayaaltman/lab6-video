// Scene 4 — Why Eve is stuck (SCRIPT.md). 8.5 s at 30 fps.
// Starts from Scene 3's layout, pushes in on Eve, then contrasts mixing (easy) with un-mixing (impossible).
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ALICE,
  ALICE_X,
  BG,
  BOB,
  BOB_X,
  BROWN,
  Caption,
  Drop,
  EVE_X,
  FONT,
  GREEN,
  Key,
  MUTED,
  ORANGE,
  PUBLIC,
  Person,
  Pot,
  clamp,
  pop,
} from "../shared";

export const EVE_STUCK_FRAMES = 255;

// Narration timing (frames). s4-a 2.05 s, s4-b 1.88 s, s4-c 3.13 s.
const A_AT = 8; // "Eve has every mixture,"
const B_AT = 70; // "but mixing is easy,"
const C_AT = 128; // "and un-mixing is practically impossible."

// Layout
const POT_Y = 500;
const TRAY_Y = 735;
const EVE_Y = 850;
const PANEL_Y = 735;
const MIX_X = 500;
const UNMIX_X = 1420;
const OK = "#5cb85c";
const BAD = "#e05252";
const LIGHT_BROWN = "#a8703f";

const ease = Easing.inOut(Easing.cubic);

const Arrow = ({ x, y, width = 130, progress = 1, crack = 0, color = "#c9ccd2" }) => {
  // Two halves so it can crack apart in the middle.
  const half = width / 2;
  const halfStyle = (dir) => ({
    position: "absolute",
    top: 0,
    left: dir < 0 ? 0 : half,
    width: half,
    height: 40,
    overflow: "hidden",
    transformOrigin: dir < 0 ? "100% 50%" : "0% 50%",
    transform: `translate(${dir * crack * 18}px, ${crack * 14}px) rotate(${dir * -crack * 22}deg)`,
  });
  const svg = (
    <svg width={width} height={40} viewBox={`0 0 ${width} 40`}>
      <line x1="4" y1="20" x2={(width - 22) * progress + 4} y2="20" stroke={color} strokeWidth="8" strokeLinecap="round" />
      {progress > 0.95 && <path d={`M${width - 26} 6 L${width - 4} 20 L${width - 26} 34`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
  return (
    <div style={{ position: "absolute", left: x - half, top: y - 20, width, height: 40, opacity: 1 - crack * 0.5 }}>
      <div style={halfStyle(-1)}>{svg}</div>
      <div style={halfStyle(1)}>
        <div style={{ marginLeft: -half }}>{svg}</div>
      </div>
    </div>
  );
};

const Panel = ({ x, title, titleColor, appear }) => (
  <div
    style={{
      position: "absolute",
      left: x - 380,
      top: PANEL_Y - 150,
      width: 760,
      height: 300,
      borderRadius: 26,
      background: "#1d2027",
      border: "2px solid #2c3039",
      opacity: appear,
      transform: `translateY(${(1 - appear) * 30}px)`,
    }}
  >
    <div style={{ marginTop: 16, textAlign: "center", fontSize: 30, letterSpacing: 6, color: titleColor, fontWeight: 700 }}>{title}</div>
  </div>
);

const Verdict = ({ x, color, appear, children }) => (
  <div
    style={{
      position: "absolute",
      left: x - 380,
      top: PANEL_Y + 74,
      width: 760,
      textAlign: "center",
      fontSize: 40,
      fontWeight: 700,
      color,
      opacity: Math.min(1, appear),
      transform: `scale(${appear})`,
    }}
  >
    {children}
  </div>
);

export const EveStuck = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [240, 255], [1, 0], clamp);

  // Push in on Eve: everything else leaves, Eve and her tray rise and grow.
  const others = interpolate(frame, [0, 20], [1, 0], clamp);
  const push = interpolate(frame, [6, 44], [0, 1], { ...clamp, easing: ease });
  const tilt = interpolate(frame, [A_AT + 30, A_AT + 40, A_AT + 50], [0, 1, 0], clamp); // tray "shows off" its mixtures

  // Mixing panel
  const mixPanel = interpolate(frame, [B_AT - 6, B_AT + 6], [0, 1], clamp);
  const mixArrow = interpolate(frame, [B_AT + 8, B_AT + 20], [0, 1], clamp);
  const dropT = interpolate(frame, [B_AT + 4, B_AT + 22], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const mixColor = interpolateColors(interpolate(frame, [B_AT + 20, B_AT + 34], [0, 1], clamp), [0, 1], [PUBLIC, ORANGE]);
  const mixOk = pop(frame, fps, B_AT + 34, 10);

  // Un-mixing panel
  const unPanel = interpolate(frame, [C_AT - 6, C_AT + 6], [0, 1], clamp);
  const unArrow = interpolate(frame, [C_AT + 8, C_AT + 26], [0, 0.82], clamp); // never quite arrives
  const wobble = frame > C_AT + 10 ? Math.sin((frame - C_AT) / 2.2) * interpolate(frame, [C_AT + 10, C_AT + 30, C_AT + 70], [0, 1, 0.3], clamp) : 0;
  const crack = interpolate(frame, [C_AT + 40, C_AT + 56], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const question = interpolate(frame, [C_AT + 24, C_AT + 36], [0, 1], clamp);
  const unBad = pop(frame, fps, C_AT + 56, 10);

  // Eve gives up; the key stays out of reach
  const stuck = interpolate(frame, [C_AT + 70, C_AT + 84], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, opacity: fadeOut }}>
      <Sequence from={A_AT}>
        <Audio src={staticFile("s4-a.wav")} />
      </Sequence>
      <Sequence from={B_AT}>
        <Audio src={staticFile("s4-b.wav")} />
      </Sequence>
      <Sequence from={C_AT}>
        <Audio src={staticFile("s4-c.wav")} />
      </Sequence>

      {/* Scene 3 leftovers fading away */}
      <div style={{ opacity: others }}>
        <Person name="Alice" x={ALICE_X} y={220} color={ALICE} />
        <Person name="Bob" x={BOB_X} y={220} color={BOB} />
        <Pot x={ALICE_X} y={POT_Y} width={200} color={BROWN} />
        <Pot x={BOB_X} y={POT_Y} width={200} color={BROWN} />
      </div>

      {/* Eve and her tray, pushed in */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${EVE_X}px ${TRAY_Y}px`,
          transform: `translateY(${-460 * push}px) scale(${1 + 0.3 * push})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: EVE_X - 230,
            top: TRAY_Y - 58,
            width: 460,
            height: 116,
            borderRadius: 18,
            border: `3px dashed ${MUTED}`,
          }}
        />
        {[PUBLIC, ORANGE, GREEN].map((c, i) => (
          <Pot key={c} x={EVE_X - 140 + i * 140} y={TRAY_Y - 6 - tilt * 8} width={90} color={c} outline />
        ))}
        <div
          style={{
            position: "absolute",
            left: EVE_X - 400,
            top: EVE_Y - 50,
            width: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "#23262e",
              boxShadow: `0 0 0 5px ${MUTED}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 46,
              fontWeight: 800,
              color: MUTED,
              transform: `rotate(${stuck * Math.sin(frame / 3) * 6}deg)`,
            }}
          >
            E
          </div>
          <div style={{ fontSize: 40, color: MUTED, position: "relative", whiteSpace: "nowrap" }}>
            <span style={{ opacity: 1 - stuck }}>
              <b style={{ color: "#c9ccd2" }}>Eve</b> has every mixture
            </span>
            <span style={{ position: "absolute", left: 0, opacity: stuck }}>
              <b style={{ color: "#c9ccd2" }}>Eve</b> is stuck
            </span>
          </div>
        </div>
        {/* The key she can't reach */}
        <Key
          x={EVE_X + 340}
          y={TRAY_Y}
          size={110}
          color={LIGHT_BROWN}
          style={{ opacity: 0.25 + 0.15 * stuck, filter: "grayscale(0.3)" }}
        />
      </div>

      {/* Mixing: easy */}
      <Panel x={MIX_X} title="MIXING" titleColor={OK} appear={mixPanel} />
      <div style={{ opacity: mixPanel }}>
        <Pot x={MIX_X - 250} y={PANEL_Y + 10} width={120} color={PUBLIC} />
        <div style={{ position: "absolute", left: MIX_X - 165, top: PANEL_Y - 22, fontSize: 50, color: "#c9ccd2" }}>+</div>
        {dropT < 1 ? (
          <Drop x={MIX_X - 95} y={PANEL_Y - 50 + dropT * 50} color={ALICE} size={40} />
        ) : (
          <Drop x={MIX_X - 95} y={PANEL_Y} color={ALICE} size={40} />
        )}
        <Arrow x={MIX_X + 50} y={PANEL_Y + 6} progress={mixArrow} />
        <Pot
          x={MIX_X + 230}
          y={PANEL_Y + 10}
          width={120}
          color={mixColor}
          style={{ opacity: mixArrow, transform: `scale(${0.7 + 0.3 * mixArrow})` }}
        />
      </div>
      <Verdict x={MIX_X} color={OK} appear={mixOk}>
        ✓ easy
      </Verdict>

      {/* Un-mixing: impossible */}
      <Panel x={UNMIX_X} title="UN-MIXING" titleColor={BAD} appear={unPanel} />
      <div style={{ opacity: unPanel }}>
        <Pot
          x={UNMIX_X - 250}
          y={PANEL_Y + 10}
          width={120}
          color={ORANGE}
          style={{ transform: `rotate(${wobble * 8}deg) translateX(${wobble * 6}px)` }}
        />
        <Arrow x={UNMIX_X - 90} y={PANEL_Y + 6} progress={unArrow} crack={crack} color={interpolateColors(crack, [0, 1], ["#c9ccd2", BAD])} />
        <div style={{ opacity: 0.35 + 0.65 * question }}>
          <Pot x={UNMIX_X + 90} y={PANEL_Y + 10} width={100} color="none" outline />
          <div style={{ position: "absolute", left: UNMIX_X + 158, top: PANEL_Y - 22, fontSize: 50, color: "#c9ccd2" }}>+</div>
          <div
            style={{
              position: "absolute",
              left: UNMIX_X + 205,
              top: PANEL_Y - 20,
              width: 60,
              height: 60,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              border: `4px dashed ${MUTED}`,
            }}
          />
          {[UNMIX_X + 90, UNMIX_X + 235].map((qx) => (
            <div
              key={qx}
              style={{
                position: "absolute",
                left: qx - 30,
                top: PANEL_Y - 28,
                width: 60,
                textAlign: "center",
                fontSize: 56,
                fontWeight: 800,
                color: "#c9ccd2",
                opacity: question,
              }}
            >
              ?
            </div>
          ))}
        </div>
      </div>
      <Verdict x={UNMIX_X} color={BAD} appear={unBad}>
        ✗ practically impossible
      </Verdict>

      <Caption frame={frame} from={A_AT} to={B_AT - 4}>
        Eve has every mixture…
      </Caption>
      <Caption frame={frame} from={B_AT} to={C_AT - 4}>
        …but mixing is <span style={{ color: OK, fontWeight: 700 }}>easy</span>
      </Caption>
      <Caption frame={frame} from={C_AT} to={255}>
        and un-mixing is <span style={{ color: BAD, fontWeight: 700 }}>practically impossible</span>
      </Caption>
    </AbsoluteFill>
  );
};
