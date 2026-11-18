// Scene 5 — The real version, with numbers (SCRIPT.md). 20 s at 30 fps.
// g = 5, p = 23, a = 6, b = 15  ->  A = 8, B = 19, shared key = 2 (verified in SCRIPT.md).
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
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
  EVE_X,
  FONT,
  GREEN,
  MUTED,
  ORANGE,
  PUBLIC,
  Person,
  clamp,
  pop,
} from "../shared";

export const NUMBERS_FRAMES = 600;

// Narration timing (frames). s5-a 3.50 s, b 5.45 s, c 3.02 s, d 3.40 s, e 1.75 s.
const A_AT = 8; // "With numbers, everyone knows five and twenty three."
const B_AT = 120; // "Alice keeps six secret, and sends five to the sixth, mod twenty three, which is eight."
const C_AT = 292; // "Bob keeps fifteen, and sends nineteen."
const D_AT = 390; // "Each raises what they receive to their own secret."
const E_AT = 500; // "Both get two."

// Beats
const G_AT = A_AT + 40; // "five"
const P_AT = A_AT + 66; // "twenty three"
const ALICE_SECRET_AT = B_AT + 20; // "six secret"
const ALICE_EQ_AT = B_AT + 58; // "five to the sixth, mod twenty three"
const ALICE_RES_AT = B_AT + 132; // "eight"
const SEND_A = [B_AT + 150, B_AT + 182];
const BOB_SECRET_AT = C_AT + 16; // "fifteen"
const BOB_EQ_AT = C_AT + 30;
const BOB_RES_AT = C_AT + 62; // "nineteen"
const SEND_B = [C_AT + 70, C_AT + 100];
const FINAL_EQ_AT = D_AT + 30; // "raises what they receive"
const KEY_AT = E_AT + 12; // "two"

// Layout
const PERSON_Y = 190;
const PUBLIC_Y = 175;
const SECRET_Y = 400;
const EQ_Y = 510;
const CHANNEL_Y = 615;
const FINAL_Y = 730;
const TRAY_Y = 880;
const LIGHT_BROWN = "#a8703f";

const ease = Easing.inOut(Easing.cubic);

// A rounded number card. (x, y) is its centre.
const Card = ({ x, y, color, children, scale = 1, opacity = 1, ghost = false, glow = 0, size = 44 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      padding: "8px 22px",
      borderRadius: 16,
      whiteSpace: "nowrap",
      fontSize: size,
      fontWeight: 800,
      background: ghost ? "#2a2e37" : color,
      color: ghost ? color : BG,
      border: ghost ? `3px solid ${MUTED}` : "none",
      boxShadow: glow ? `0 0 ${36 * glow}px ${LIGHT_BROWN}` : "0 6px 18px rgba(0,0,0,0.35)",
    }}
  >
    {children}
  </div>
);

// "base^exp mod 23 = [result]" written on, centred on x.
const Equation = ({ x, y, base, baseColor, exp, expColor, write, result, resultColor, resultScale, glow = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x - 300,
      top: y - 40,
      width: 600,
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      fontSize: 48,
      fontWeight: 700,
      color: "#e8e8ea",
      opacity: write,
      transform: `translateY(${(1 - write) * 14}px)`,
    }}
  >
    <span>
      <span style={{ color: baseColor }}>{base}</span>
      <sup style={{ color: expColor, fontSize: 32 }}>{exp}</sup>
    </span>
    <span style={{ color: "#c9ccd2", fontWeight: 400 }}>mod</span>
    <span style={{ color: PUBLIC }}>23</span>
    <span style={{ opacity: Math.min(1, resultScale * 2) }}>=</span>
    <span
      style={{
        display: "inline-block",
        padding: "4px 18px",
        borderRadius: 14,
        background: resultColor,
        color: BG,
        fontWeight: 800,
        transform: `scale(${resultScale})`,
        boxShadow: glow ? `0 0 ${36 * glow}px ${LIGHT_BROWN}` : "none",
      }}
    >
      {result}
    </span>
  </div>
);

export const Numbers = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 12], [0, 1], clamp);
  const fadeOut = interpolate(frame, [585, 600], [1, 0], clamp);

  const gPop = pop(frame, fps, G_AT);
  const pPop = pop(frame, fps, P_AT);
  const publicLabel = interpolate(frame, [G_AT, G_AT + 12], [0, 1], clamp);

  const aSecret = pop(frame, fps, ALICE_SECRET_AT);
  const aEq = interpolate(frame, [ALICE_EQ_AT, ALICE_EQ_AT + 14], [0, 1], clamp);
  const aRes = pop(frame, fps, ALICE_RES_AT, 10);
  const bSecret = pop(frame, fps, BOB_SECRET_AT);
  const bEq = interpolate(frame, [BOB_EQ_AT, BOB_EQ_AT + 14], [0, 1], clamp);
  const bRes = pop(frame, fps, BOB_RES_AT, 10);

  // Sent values travel along the channel to the other side.
  const sendA = interpolate(frame, SEND_A, [0, 1], { ...clamp, easing: ease });
  const sendB = interpolate(frame, SEND_B, [0, 1], { ...clamp, easing: ease });
  const travel = (t, fromX, toX) => ({
    x: fromX + (toX - fromX) * t,
    y: EQ_Y + (CHANNEL_Y - EQ_Y) * Math.min(1, t * 4),
  });
  const eightPos = travel(sendA, ALICE_X + 150, BOB_X);
  const nineteenPos = travel(sendB, BOB_X + 100, ALICE_X);

  const finalEq = interpolate(frame, [FINAL_EQ_AT, FINAL_EQ_AT + 14], [0, 1], clamp);
  const keyPop = pop(frame, fps, KEY_AT, 9);
  const glow = interpolate(frame, [KEY_AT, KEY_AT + 14], [0, 1], clamp) * (0.75 + 0.25 * Math.sin((frame - KEY_AT) / 6));
  const equals = pop(frame, fps, KEY_AT + 8, 10);
  const eveNote = interpolate(frame, [KEY_AT + 26, KEY_AT + 40], [0, 1], clamp);

  // Eve's tray: grey copies of everything that is public.
  const TRAY_SLOTS = [EVE_X - 135, EVE_X - 15, EVE_X + 105, EVE_X + 225];
  const eveCopies = [
    { text: "5", color: PUBLIC, at: G_AT + 14, fromX: EVE_X - 120, fromY: PUBLIC_Y },
    { text: "23", color: PUBLIC, at: P_AT + 14, fromX: EVE_X + 120, fromY: PUBLIC_Y },
    { text: "8", color: ORANGE, at: (SEND_A[0] + SEND_A[1]) / 2, fromX: EVE_X, fromY: CHANNEL_Y },
    { text: "19", color: GREEN, at: (SEND_B[0] + SEND_B[1]) / 2, fromX: EVE_X, fromY: CHANNEL_Y },
  ];
  const COPY_LEN = 18;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, opacity: fadeOut }}>
      {[
        ["s5-a.wav", A_AT],
        ["s5-b.wav", B_AT],
        ["s5-c.wav", C_AT],
        ["s5-d.wav", D_AT],
        ["s5-e.wav", E_AT],
      ].map(([f, at]) => (
        <Sequence key={f} from={at}>
          <Audio src={staticFile(f)} />
        </Sequence>
      ))}

      {/* Public channel */}
      <div
        style={{
          position: "absolute",
          left: ALICE_X + 120,
          width: BOB_X - ALICE_X - 240,
          top: CHANNEL_Y - 4,
          height: 8,
          borderRadius: 4,
          background: PUBLIC,
          opacity: 0.35 * enter,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: CHANNEL_Y - 50,
          width: "100%",
          textAlign: "center",
          fontSize: 26,
          letterSpacing: 6,
          color: PUBLIC,
          opacity: 0.7 * enter,
        }}
      >
        PUBLIC CHANNEL
      </div>

      <Person name="Alice" x={ALICE_X} y={PERSON_Y} color={ALICE} opacity={enter} />
      <Person name="Bob" x={BOB_X} y={PERSON_Y} color={BOB} opacity={enter} />

      {/* Public numbers */}
      <div
        style={{
          position: "absolute",
          top: PUBLIC_Y - 95,
          width: "100%",
          textAlign: "center",
          fontSize: 28,
          letterSpacing: 6,
          fontWeight: 700,
          color: PUBLIC,
          opacity: publicLabel,
        }}
      >
        PUBLIC
      </div>
      <Card x={EVE_X - 120} y={PUBLIC_Y} color={PUBLIC} scale={gPop}>g = 5</Card>
      <Card x={EVE_X + 120} y={PUBLIC_Y} color={PUBLIC} scale={pPop}>p = 23</Card>

      {/* Secrets */}
      <Card x={ALICE_X} y={SECRET_Y} color={ALICE} scale={aSecret}>a = 6</Card>
      <div style={{ position: "absolute", left: ALICE_X - 100, width: 200, top: SECRET_Y + 38, textAlign: "center", fontSize: 26, color: ALICE, opacity: aSecret }}>
        secret
      </div>
      <Card x={BOB_X} y={SECRET_Y} color={BOB} scale={bSecret}>b = 15</Card>
      <div style={{ position: "absolute", left: BOB_X - 100, width: 200, top: SECRET_Y + 38, textAlign: "center", fontSize: 26, color: BOB, opacity: bSecret }}>
        secret
      </div>

      {/* What each one sends */}
      <Equation x={ALICE_X} y={EQ_Y} base="5" baseColor={PUBLIC} exp="6" expColor={ALICE} write={aEq} result="8" resultColor={ORANGE} resultScale={aRes} />
      <Equation x={BOB_X - 50} y={EQ_Y} base="5" baseColor={PUBLIC} exp="15" expColor={BOB} write={bEq} result="19" resultColor={GREEN} resultScale={bRes} />

      {/* Sent values on the channel */}
      {frame >= SEND_A[0] && <Card x={eightPos.x} y={eightPos.y} color={ORANGE}>8</Card>}
      {frame >= SEND_B[0] && <Card x={nineteenPos.x} y={nineteenPos.y} color={GREEN}>19</Card>}

      {/* What each one computes from what they received */}
      <Equation x={ALICE_X} y={FINAL_Y} base="19" baseColor={GREEN} exp="6" expColor={ALICE} write={finalEq} result="2" resultColor={LIGHT_BROWN} resultScale={keyPop} glow={glow} />
      <Equation x={BOB_X - 50} y={FINAL_Y} base="8" baseColor={ORANGE} exp="15" expColor={BOB} write={finalEq} result="2" resultColor={LIGHT_BROWN} resultScale={keyPop} glow={glow} />
      <div
        style={{
          position: "absolute",
          top: FINAL_Y - 70,
          width: "100%",
          textAlign: "center",
          fontSize: 120,
          fontWeight: 800,
          lineHeight: 1,
          color: LIGHT_BROWN,
          transform: `scale(${equals})`,
          textShadow: `0 0 ${30 * glow}px ${LIGHT_BROWN}`,
        }}
      >
        =
      </div>

      {/* Eve, with her tray of copies */}
      <div
        style={{
          position: "absolute",
          left: EVE_X - 420,
          top: TRAY_Y - 45,
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
          opacity: enter,
        }}
      >
        E
      </div>
      <div
        style={{
          position: "absolute",
          left: EVE_X - 200,
          top: TRAY_Y - 50,
          width: 500,
          height: 100,
          borderRadius: 18,
          border: `3px dashed ${MUTED}`,
          opacity: enter,
        }}
      />
      <div style={{ position: "absolute", left: EVE_X - 310, top: TRAY_Y - 22, fontSize: 36, fontWeight: 700, color: "#c9ccd2", opacity: enter }}>
        Eve
      </div>
      {eveCopies.map((c, i) => {
        if (frame < c.at) return null;
        const t = interpolate(frame, [c.at, c.at + COPY_LEN], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
        return (
          <Card
            key={c.text}
            x={c.fromX + (TRAY_SLOTS[i] - c.fromX) * t}
            y={c.fromY + (TRAY_Y - c.fromY) * t}
            color={c.color}
            ghost
            size={40}
            scale={1 - 0.15 * t}
          >
            {c.text}
          </Card>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: TRAY_Y + 64,
          width: "100%",
          textAlign: "center",
          fontSize: 34,
          color: MUTED,
          opacity: eveNote,
        }}
      >
        no <span style={{ color: ALICE, fontWeight: 700 }}>6</span>, no <span style={{ color: BOB, fontWeight: 700 }}>15</span>, no{" "}
        <span style={{ color: LIGHT_BROWN, fontWeight: 700 }}>2</span>
      </div>
    </AbsoluteFill>
  );
};
