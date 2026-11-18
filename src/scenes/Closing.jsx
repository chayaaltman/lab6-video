// Scene 7 — Scale and closing (SCRIPT.md). 13 s at 30 fps.
// The digit wall is the real value of 2^2048 (617 digits), the size of a real key.
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
  Caption,
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

export const CLOSING_FRAMES = 390;

// Narration timing (frames). s7-a 2.92 s, s7-b 3.42 s, s7-c 3.30 s.
const A_AT = 8; // "Real keys have over six hundred digits,"
const B_AT = 110; // "and your browser does this on every secure website."
const C_AT = 226; // "Everything was public, yet the key stayed secret."

const DIGITS = (2n ** 2048n).toString(); // 617 digits
const PER_LINE = 62;
const LINES = Array.from({ length: Math.ceil(DIGITS.length / PER_LINE) }, (_, i) => DIGITS.slice(i * PER_LINE, (i + 1) * PER_LINE));

const LIGHT_BROWN = "#a8703f";
const BAD = "#e05252";

const Padlock = ({ size = 70, color, glow = 0 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 60 70" style={{ filter: `drop-shadow(0 0 ${20 * glow}px ${LIGHT_BROWN})` }}>
    <path d="M16 30 V20 a14 14 0 0 1 28 0 V30" fill="none" stroke={color} strokeWidth="7" />
    <rect x="6" y="30" width="48" height="36" rx="7" fill={color} />
    <circle cx="30" cy="46" r="5" fill={BG} />
    <rect x="28" y="48" width="4" height="9" rx="2" fill={BG} />
  </svg>
);

export const Closing = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [368, 390], [1, 0], clamp);

  // Part A: the wall of digits
  const typed = Math.floor(interpolate(frame, [A_AT, A_AT + 55], [0, DIGITS.length], clamp));
  const wallOut = interpolate(frame, [B_AT - 10, B_AT + 4], [1, 0], clamp);
  const wallScale = interpolate(frame, [A_AT, B_AT], [1.04, 1], clamp);
  const stamp = pop(frame, fps, A_AT + 62, 9);

  // Part B: the browser
  const browserIn = interpolate(frame, [B_AT - 2, B_AT + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const browserOut = interpolate(frame, [C_AT - 10, C_AT + 4], [1, 0], clamp);
  const lock = pop(frame, fps, B_AT + 34, 9);
  const lockGlow = interpolate(frame, [B_AT + 34, B_AT + 50], [0, 1], clamp) * (0.75 + 0.25 * Math.sin((frame - B_AT) / 6));
  const urlTyped = Math.floor(interpolate(frame, [B_AT + 12, B_AT + 32], [0, "https://example.com".length], clamp));
  const browserNote = interpolate(frame, [B_AT + 56, B_AT + 70], [0, 1], clamp);

  // Part C: back to the paint picture, and the title
  const finalIn = interpolate(frame, [C_AT - 4, C_AT + 12], [0, 1], clamp);
  const title1 = interpolate(frame, [C_AT + 50, C_AT + 64], [0, 1], clamp);
  const title2 = interpolate(frame, [C_AT + 68, C_AT + 82], [0, 1], clamp);
  const keyGlow = 0.75 + 0.25 * Math.sin(frame / 6);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, opacity: fadeOut }}>
      <Sequence from={A_AT}>
        <Audio src={staticFile("s7-a.wav")} />
      </Sequence>
      <Sequence from={B_AT}>
        <Audio src={staticFile("s7-b.wav")} />
      </Sequence>
      <Sequence from={C_AT}>
        <Audio src={staticFile("s7-c.wav")} />
      </Sequence>

      {/* A: 617 digits */}
      {wallOut > 0 && (
        <div style={{ opacity: wallOut }}>
          <div
            style={{
              position: "absolute",
              top: 60,
              width: "100%",
              textAlign: "center",
              fontSize: 32,
              letterSpacing: 5,
              fontWeight: 700,
              color: PUBLIC,
            }}
          >
            A REAL-SIZE NUMBER: 2<sup style={{ fontSize: 20 }}>2048</sup>
          </div>
          <div
            style={{
              position: "absolute",
              top: 150,
              left: 0,
              width: "100%",
              textAlign: "center",
              fontFamily: "Consolas, 'Courier New', monospace",
              fontSize: 40,
              lineHeight: "54px",
              color: "#6b7080",
              transform: `scale(${wallScale})`,
            }}
          >
            {LINES.map((line, i) => {
              const start = i * PER_LINE;
              const shown = Math.max(0, Math.min(line.length, typed - start));
              return (
                <div key={i} style={{ height: 54 }}>
                  {line.slice(0, shown)}
                  <span style={{ opacity: 0 }}>{line.slice(shown)}</span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              left: EVE_X - 330,
              top: 380,
              width: 660,
              padding: "18px 0",
              textAlign: "center",
              borderRadius: 18,
              border: `6px solid ${BAD}`,
              background: "rgba(21,23,28,0.92)",
              color: BAD,
              fontSize: 46,
              fontWeight: 800,
              letterSpacing: 2,
              transform: `rotate(-6deg) scale(${stamp})`,
              opacity: Math.min(1, stamp),
            }}
          >
            617 DIGITS
            <div style={{ fontSize: 32, fontWeight: 600, color: "#e8e8ea", letterSpacing: 0, marginTop: 4 }}>
              no computer can un-mix this
            </div>
          </div>
        </div>
      )}

      {/* B: the browser */}
      {browserIn > 0 && browserOut > 0 && (
        <div
          style={{
            position: "absolute",
            left: EVE_X - 650,
            top: 200,
            width: 1300,
            height: 560,
            borderRadius: 26,
            background: "#1d2027",
            border: "3px solid #2c3039",
            opacity: Math.min(browserIn, browserOut),
            transform: `translateY(${(1 - browserIn) * 40}px)`,
            overflow: "hidden",
          }}
        >
          <div style={{ height: 120, background: "#23262e", display: "flex", alignItems: "center", padding: "0 34px", gap: 30 }}>
            <div style={{ display: "flex", gap: 14 }}>
              {["#e05252", "#e0b252", "#5cb85c"].map((c) => (
                <div key={c} style={{ width: 22, height: 22, borderRadius: "50%", background: c, opacity: 0.8 }} />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                height: 74,
                borderRadius: 37,
                background: BG,
                display: "flex",
                alignItems: "center",
                padding: "0 30px",
                gap: 22,
                fontSize: 44,
                color: "#e8e8ea",
              }}
            >
              <div style={{ transform: `scale(${lock})`, display: "flex" }}>
                <Padlock size={44} color={LIGHT_BROWN} glow={lockGlow} />
              </div>
              <span>
                <span style={{ color: "#5cb85c" }}>{"https://example.com".slice(0, Math.min(urlTyped, 8))}</span>
                {"https://example.com".slice(8, urlTyped)}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60, marginTop: 90, opacity: browserNote }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: ALICE }}>your browser</div>
            <Key x={0} y={0} size={140} color={LIGHT_BROWN} style={{ position: "relative", left: 0, top: 0, filter: `drop-shadow(0 0 ${18 * lockGlow}px ${LIGHT_BROWN})` }} />
            <div style={{ fontSize: 40, fontWeight: 700, color: BOB }}>the website</div>
          </div>
          <div style={{ textAlign: "center", marginTop: 50, fontSize: 36, color: MUTED, opacity: browserNote }}>
            a key exchange like this starts every secure connection
          </div>
        </div>
      )}

      {/* C: the final picture */}
      {finalIn > 0 && (
        <div style={{ opacity: finalIn }}>
          <div style={{ position: "absolute", top: 48, width: "100%", textAlign: "center", fontSize: 60, fontWeight: 800, color: "#f4f4f5" }}>
            <span style={{ opacity: title1 }}>
              Mixing is <span style={{ color: "#5cb85c" }}>easy</span>.
            </span>{" "}
            <span style={{ opacity: title2 }}>
              Un-mixing is <span style={{ color: BAD }}>impossible</span>.
            </span>
          </div>
          <Person name="Alice" x={ALICE_X} y={250} color={ALICE} />
          <Person name="Bob" x={BOB_X} y={250} color={BOB} />
          {[ALICE_X, BOB_X].map((x) => (
            <div key={x}>
              <Pot x={x} y={520} width={200} color={BROWN} style={{ filter: `drop-shadow(0 0 ${26 * keyGlow}px ${LIGHT_BROWN})` }} />
              <Key x={x} y={645} size={130} color={LIGHT_BROWN} style={{ filter: `drop-shadow(0 0 ${16 * keyGlow}px ${LIGHT_BROWN})` }} />
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              left: EVE_X - 230,
              top: 520 - 58,
              width: 460,
              height: 116,
              borderRadius: 18,
              border: `3px dashed ${MUTED}`,
            }}
          />
          {[PUBLIC, ORANGE, GREEN].map((c, i) => (
            <Pot key={c} x={EVE_X - 140 + i * 140} y={514} width={90} color={c} outline />
          ))}
          <div style={{ position: "absolute", top: 610, width: "100%", textAlign: "center", fontSize: 40, color: MUTED }}>
            <b style={{ color: "#c9ccd2" }}>Eve</b> saw everything, and has no key
          </div>
        </div>
      )}

      <Caption frame={frame} from={A_AT} to={B_AT - 6}>
        Real keys have over <b>600 digits</b>
      </Caption>
      <Caption frame={frame} from={B_AT} to={C_AT - 6}>
        Your browser does this on every <span style={{ color: LIGHT_BROWN, fontWeight: 700 }}>secure website</span>
      </Caption>
      <Caption frame={frame} from={C_AT} to={390}>
        Everything was public, yet the key stayed <span style={{ color: LIGHT_BROWN, fontWeight: 700 }}>secret</span>
      </Caption>
    </AbsoluteFill>
  );
};
