// Scene 6 — Clock arithmetic: one-way (SCRIPT.md). 11.7 s at 30 fps.
// Powers of 5 mod 23: 5, 2, 10, 4, 20, 8, ... (verified); only exponent 6 lands on 8.
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
import { ALICE, BG, Caption, FONT, MUTED, ORANGE, PUBLIC, clamp, pop } from "../shared";

export const CLOCK_FRAMES = 350;

// Narration timing (frames). s6-a 2.23 s, s6-b 3.00 s, s6-c 4.53 s.
const A_AT = 8; // "Mod is clock arithmetic."
const B_AT = 84; // "Forward is quick, but answers jump around,"
const C_AT = 182; // "so going backward, the discrete logarithm problem, means guessing."

const N = 23;
const POWERS = [5, 2, 10, 4, 20, 8]; // 5^1 .. 5^6 mod 23
const TARGET = 8;

// Beats
const WRAP = [28, 68]; // 25 steps around the clock lands on 2
const HOP_START = B_AT + 4;
const HOP_EVERY = 12;
const TRY_START = C_AT + 30;
const TRY_EVERY = 15;
const OK = "#5cb85c";
const BAD = "#e05252";

// Clock geometry
const CX = 960;
const CY = 470;
const R = 290;
const angleOf = (k) => (-90 + (k * 360) / N) * (Math.PI / 180);
const pointAt = (k, r = R) => ({ x: CX + r * Math.cos(angleOf(k)), y: CY + r * Math.sin(angleOf(k)) });

const sup = (n) => String(n).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("");

// A dot hopping along a sequence of clock positions; returns the current dot and finished segments.
const hopState = (frame, start, every, seq, from = 1) => {
  const segs = [];
  let dot = null;
  let prev = from;
  seq.forEach((k, i) => {
    const t0 = start + i * every;
    const t = interpolate(frame, [t0, t0 + every * 0.7], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
    const a = pointAt(prev);
    const b = pointAt(k);
    if (frame >= t0) {
      segs.push({ a, b: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, landed: t >= 1, k, i });
      dot = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    prev = k;
  });
  return { segs, dot };
};

const ListRow = ({ appear, children, color = "#e8e8ea" }) => (
  <div
    style={{
      fontSize: 40,
      fontWeight: 700,
      color,
      opacity: appear,
      transform: `translateX(${(1 - appear) * -20}px)`,
      height: 52,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export const Clock = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [336, 350], [1, 0], clamp);
  const draw = interpolate(frame, [0, 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // "Mod is clock arithmetic": a hand sweeps 25 steps and lands on 2.
  const wrapSteps = interpolate(frame, WRAP, [0, 25], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const handFade = interpolate(frame, [B_AT - 6, B_AT + 4], [1, 0], clamp);
  const hand = pointAt(wrapSteps, R - 50);
  const wrapLabel = interpolate(frame, [WRAP[1] - 4, WRAP[1] + 8], [0, 1], clamp) * handFade;

  // Forward: hop through 5^1..5^6.
  const fwd = hopState(frame, HOP_START, HOP_EVERY, POWERS, 0);
  const fwdDim = interpolate(frame, [C_AT, C_AT + 15], [1, 0.25], clamp);

  // Backward: Eve tries exponents until she lands on 8.
  const back = hopState(frame, TRY_START, TRY_EVERY, POWERS, 0);
  const targetRing = interpolate(frame, [C_AT + 6, C_AT + 18], [0, 1], clamp);
  const leftPanel = interpolate(frame, [B_AT - 4, B_AT + 8], [0, 1], clamp);
  const rightPanel = interpolate(frame, [C_AT, C_AT + 12], [0, 1], clamp);
  const foundAt = TRY_START + (POWERS.length - 1) * TRY_EVERY + TRY_EVERY * 0.7;
  const guessNote = pop(frame, fps, foundAt + 10, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, opacity: fadeOut }}>
      <Sequence from={A_AT}>
        <Audio src={staticFile("s6-a.wav")} />
      </Sequence>
      <Sequence from={B_AT}>
        <Audio src={staticFile("s6-b.wav")} />
      </Sequence>
      <Sequence from={C_AT}>
        <Audio src={staticFile("s6-c.wav")} />
      </Sequence>

      <div
        style={{
          position: "absolute",
          top: 40,
          width: "100%",
          textAlign: "center",
          fontSize: 34,
          letterSpacing: 6,
          color: PUBLIC,
          fontWeight: 700,
          opacity: draw,
        }}
      >
        MOD 23 = A CLOCK WITH 23 HOURS
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Clock face */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="#3a3f4b"
          strokeWidth={6}
          strokeDasharray={2 * Math.PI * R}
          strokeDashoffset={2 * Math.PI * R * (1 - draw)}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
        {Array.from({ length: N }, (_, k) => {
          const p = pointAt(k);
          const lp = pointAt(k, R + 42);
          const appear = interpolate(frame, [4 + k, 14 + k], [0, 1], clamp);
          const isTarget = k === TARGET;
          return (
            <g key={k} opacity={appear}>
              <circle cx={p.x} cy={p.y} r={7} fill={MUTED} />
              {isTarget && targetRing > 0 && (
                <circle cx={p.x} cy={p.y} r={30} fill="none" stroke={ORANGE} strokeWidth={5} opacity={targetRing} />
              )}
              <text
                x={lp.x}
                y={lp.y + 11}
                textAnchor="middle"
                fontSize={30}
                fontWeight={isTarget && targetRing > 0.5 ? 800 : 600}
                fill={isTarget && targetRing > 0.5 ? ORANGE : "#c9ccd2"}
                fontFamily={FONT}
              >
                {k}
              </text>
            </g>
          );
        })}

        {/* Wrap-around hand */}
        {frame >= WRAP[0] && handFade > 0 && (
          <g opacity={handFade}>
            <line x1={CX} y1={CY} x2={hand.x} y2={hand.y} stroke={PUBLIC} strokeWidth={8} strokeLinecap="round" />
            <circle cx={CX} cy={CY} r={12} fill={PUBLIC} />
          </g>
        )}

        {/* Forward hops (yellow) */}
        <g opacity={fwdDim}>
          {fwd.segs.map((s) => (
            <line key={`f${s.i}`} x1={s.a.x} y1={s.a.y} x2={s.b.x} y2={s.b.y} stroke={PUBLIC} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
          ))}
          {fwd.segs
            .filter((s) => s.landed)
            .map((s) => {
              const p = pointAt(s.k);
              const lp = pointAt(s.k, R - 50);
              return (
                <g key={`fl${s.i}`}>
                  <circle cx={p.x} cy={p.y} r={14} fill={PUBLIC} />
                  <text x={lp.x} y={lp.y + 10} textAnchor="middle" fontSize={28} fontWeight={700} fill={PUBLIC} fontFamily={FONT}>
                    5{sup(s.i + 1)}
                  </text>
                </g>
              );
            })}
          {fwd.dot && frame < C_AT && <circle cx={fwd.dot.x} cy={fwd.dot.y} r={16} fill={PUBLIC} />}
        </g>

        {/* Backward tries (grey), each miss marked */}
        {back.segs.map((s) => (
          <line key={`b${s.i}`} x1={s.a.x} y1={s.a.y} x2={s.b.x} y2={s.b.y} stroke={MUTED} strokeWidth={5} strokeLinecap="round" strokeDasharray="10 10" />
        ))}
        {back.segs
          .filter((s) => s.landed)
          .map((s) => {
            const p = pointAt(s.k);
            const hit = s.k === TARGET;
            return hit ? (
              <circle key={`bl${s.i}`} cx={p.x} cy={p.y} r={18} fill={ORANGE} />
            ) : (
              <path
                key={`bl${s.i}`}
                d={`M${p.x - 13} ${p.y - 13} L${p.x + 13} ${p.y + 13} M${p.x + 13} ${p.y - 13} L${p.x - 13} ${p.y + 13}`}
                stroke={BAD}
                strokeWidth={6}
                strokeLinecap="round"
              />
            );
          })}
        {back.dot && !(back.segs.length === POWERS.length && back.segs[back.segs.length - 1].landed) && (
          <circle cx={back.dot.x} cy={back.dot.y} r={14} fill={MUTED} />
        )}
      </svg>

      {/* Wrap example */}
      <div
        style={{
          position: "absolute",
          top: CY + 70,
          width: "100%",
          textAlign: "center",
          fontSize: 48,
          fontWeight: 700,
          color: "#e8e8ea",
          opacity: wrapLabel,
        }}
      >
        25 mod 23 = <span style={{ color: PUBLIC }}>2</span>
      </div>

      {/* Left: forward is easy */}
      <div style={{ position: "absolute", left: 110, top: 200, width: 420, opacity: leftPanel * (0.4 + 0.6 * fwdDim) }}>
        <div style={{ fontSize: 30, letterSpacing: 5, fontWeight: 700, color: OK, marginBottom: 18 }}>FORWARD: EASY</div>
        {POWERS.map((v, i) => {
          const t0 = HOP_START + i * HOP_EVERY + HOP_EVERY * 0.7;
          return (
            <ListRow key={i} appear={interpolate(frame, [t0, t0 + 6], [0, 1], clamp)}>
              <span style={{ color: PUBLIC }}>5</span>
              <sup style={{ fontSize: 26, color: ALICE }}>{i + 1}</sup> <span style={{ color: "#9aa0ad", fontWeight: 400 }}>→</span>{" "}
              <span style={{ color: v === TARGET ? ORANGE : PUBLIC }}>{v}</span>
            </ListRow>
          );
        })}
      </div>

      {/* Right: backward means guessing */}
      <div style={{ position: "absolute", left: 1390, top: 200, width: 460, opacity: rightPanel }}>
        <div style={{ fontSize: 30, letterSpacing: 5, fontWeight: 700, color: BAD, marginBottom: 18 }}>BACKWARD: GUESS</div>
        <div style={{ fontSize: 40, fontWeight: 700, color: "#e8e8ea", marginBottom: 14 }}>
          <span style={{ color: PUBLIC }}>5</span>
          <sup style={{ fontSize: 26, color: MUTED }}>?</sup> = <span style={{ color: ORANGE }}>8</span>
        </div>
        {POWERS.map((v, i) => {
          const t0 = TRY_START + i * TRY_EVERY + TRY_EVERY * 0.7;
          const hit = v === TARGET;
          return (
            <ListRow key={i} appear={interpolate(frame, [t0, t0 + 5], [0, 1], clamp)} color={MUTED}>
              try {i + 1}: {v}{" "}
              <span style={{ color: hit ? OK : BAD }}>{hit ? "✓" : "✗"}</span>
            </ListRow>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 1390,
          top: 700,
          width: 480,
          fontSize: 38,
          color: "#c9ccd2",
          opacity: Math.min(1, guessNote),
          transform: `scale(${guessNote})`,
          transformOrigin: "left center",
        }}
      >
        the <b style={{ color: BAD }}>discrete logarithm</b> problem
      </div>

      <Caption frame={frame} from={A_AT} to={B_AT - 4}>
        Mod is clock arithmetic
      </Caption>
      <Caption frame={frame} from={B_AT} to={C_AT - 4}>
        Forward is <span style={{ color: OK, fontWeight: 700 }}>quick</span>, but the answers jump around
      </Caption>
      <Caption frame={frame} from={C_AT} to={350}>
        Backward means <span style={{ color: BAD, fontWeight: 700 }}>guessing</span>
      </Caption>
    </AbsoluteFill>
  );
};
