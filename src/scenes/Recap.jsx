// Scene 8 — Putting it together (SCRIPT.md). The new ending.
// A two-column table maps every paint idea to its number version, row by row, then the takeaway.
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ALICE,
  BG,
  BOB,
  BROWN,
  Drop,
  FONT,
  GREEN,
  Key,
  MUTED,
  ORANGE,
  PUBLIC,
  Pot,
  clamp,
  pop,
} from "../shared";

// Narration clips (frames at 30 fps), played back to back with GAP frames between.
const CLIPS = [
  ["s8-0.wav", 60], // "Let's put it all together."
  ["s8-1.wav", 126], // public paint = public numbers
  ["s8-2.wav", 124], // secret colours = secret exponents
  ["s8-3.wav", 106], // mixing = raising to a power
  ["s8-4.wav", 87], // swapped mixtures = 8 and 19
  ["s8-5.wav", 133], // same brown = same key 2
  ["s8-6.wav", 147], // un-mixing = discrete logarithm
  ["s8-7.wav", 132], // "So two strangers, talking in public, end up sharing a secret."
];
const GAP = 10;
const STARTS = CLIPS.reduce((acc, [, len], i) => [...acc, i === 0 ? 8 : acc[i - 1] + CLIPS[i - 1][1] + GAP], []);
const FINAL_AT = STARTS[7];
export const RECAP_FRAMES = FINAL_AT + CLIPS[7][1] + 70;

const LIGHT_BROWN = "#a8703f";
const BAD = "#e05252";
const TEXT = "#e8e8ea";

// Layout
const LEFT_VIS = 330;
const LEFT_LABEL = 500;
const EQ_X = 960;
const RIGHT_VIS = 1190;
const RIGHT_LABEL = 1330;
const ROW0_Y = 230;
const ROW_H = 112;

const Card = ({ children, color, glow = 0 }) => (
  <span
    style={{
      display: "inline-block",
      padding: "4px 18px",
      margin: "0 6px",
      borderRadius: 14,
      background: color,
      color: BG,
      fontSize: 42,
      fontWeight: 800,
      boxShadow: glow ? `0 0 ${30 * glow}px ${LIGHT_BROWN}` : "none",
    }}
  >
    {children}
  </span>
);

const Label = ({ x, y, children }) => (
  <div style={{ position: "absolute", left: x, top: y - 24, fontSize: 38, color: TEXT, whiteSpace: "nowrap" }}>{children}</div>
);

const Centered = ({ x, y, children }) => (
  <div
    style={{
      position: "absolute",
      left: x - 200,
      width: 400,
      top: y - 40,
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export const Recap = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow = 0.75 + 0.25 * Math.sin(frame / 6);

  const fadeOut = interpolate(frame, [RECAP_FRAMES - 22, RECAP_FRAMES], [1, 0], clamp);
  const titleIn = interpolate(frame, [4, 18], [0, 1], clamp);
  const tableOut = interpolate(frame, [FINAL_AT - 8, FINAL_AT + 10], [1, 0], clamp);

  // Each row appears on its own narration line (rows 1..6 = clips 1..6).
  const rowIn = (i) => interpolate(frame, [STARTS[i + 1] + 4, STARTS[i + 1] + 16], [0, 1], clamp);
  const rightIn = (i) => interpolate(frame, [STARTS[i + 1] + 34, STARTS[i + 1] + 46], [0, 1], clamp); // number side answers a beat later
  const active = (i) => frame >= STARTS[i + 1] && frame < (STARTS[i + 2] ?? FINAL_AT);

  const ROWS = [
    {
      left: (
        <Pot x={45} y={40} width={90} color={PUBLIC} style={{ position: "absolute" }} />
      ),
      leftLabel: "public paint",
      right: (
        <>
          <Card color={PUBLIC}>5</Card>
          <Card color={PUBLIC}>23</Card>
        </>
      ),
      rightLabel: "public numbers",
    },
    {
      left: (
        <>
          <Drop x={20} y={40} color={ALICE} size={44} />
          <Drop x={80} y={40} color={BOB} size={44} />
        </>
      ),
      leftLabel: "secret colours",
      right: (
        <>
          <Card color={ALICE}>6</Card>
          <Card color={BOB}>15</Card>
        </>
      ),
      rightLabel: "secret exponents",
    },
    {
      left: (
        <>
          <Pot x={-10} y={40} width={64} color={PUBLIC} />
          <Drop x={42} y={38} color={ALICE} size={30} />
          <div style={{ position: "absolute", left: 66, top: 12, fontSize: 40, color: MUTED }}>→</div>
          <Pot x={128} y={40} width={64} color={ORANGE} />
        </>
      ),
      leftLabel: "mixing",
      right: (
        <span style={{ fontSize: 46, fontWeight: 700, color: TEXT }}>
          <span style={{ color: PUBLIC }}>5</span>
          <sup style={{ fontSize: 30, color: ALICE }}>secret</sup> mod <span style={{ color: PUBLIC }}>23</span>
        </span>
      ),
      rightLabel: "raising to a power",
    },
    {
      left: (
        <>
          <Pot x={10} y={40} width={80} color={ORANGE} />
          <Pot x={100} y={40} width={80} color={GREEN} />
        </>
      ),
      leftLabel: "swapped mixtures",
      right: (
        <>
          <Card color={ORANGE}>8</Card>
          <Card color={GREEN}>19</Card>
        </>
      ),
      rightLabel: "sent in public",
    },
    {
      left: <Pot x={50} y={40} width={96} color={BROWN} style={{ filter: `drop-shadow(0 0 ${22 * glow}px ${LIGHT_BROWN})` }} />,
      leftLabel: "same brown",
      right: (
        <Card color={LIGHT_BROWN} glow={glow}>
          2
        </Card>
      ),
      rightLabel: "same key",
    },
    {
      left: (
        <svg width={150} height={60} viewBox="0 0 150 60" style={{ position: "absolute", left: -25, top: 10 }}>
          <path d="M8 26 L62 34" stroke={BAD} strokeWidth="8" strokeLinecap="round" />
          <path d="M86 30 L122 24" stroke={BAD} strokeWidth="8" strokeLinecap="round" />
          <path d="M116 10 L140 26 L118 42" fill="none" stroke={BAD} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      leftLabel: "can't un-mix",
      right: <span style={{ fontSize: 42, fontWeight: 800, color: BAD }}>discrete log</span>,
      rightLabel: "too hard for Eve",
    },
  ];

  // Final takeaway
  const line1 = interpolate(frame, [FINAL_AT + 6, FINAL_AT + 20], [0, 1], clamp);
  const line2 = interpolate(frame, [FINAL_AT + 56, FINAL_AT + 70], [0, 1], clamp);
  const people = pop(frame, fps, FINAL_AT + 20, 13);
  const keys = pop(frame, fps, FINAL_AT + 76, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, opacity: fadeOut }}>
      {CLIPS.map(([f], i) => (
        <Sequence key={f} from={STARTS[i]}>
          <Audio src={staticFile(f)} />
        </Sequence>
      ))}

      {/* The table */}
      <div style={{ opacity: tableOut }}>
        <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontSize: 40, letterSpacing: 8, fontWeight: 800, color: "#f4f4f5", opacity: titleIn }}>
          PUTTING IT TOGETHER
        </div>
        <div style={{ position: "absolute", top: 118, left: LEFT_VIS - 60, fontSize: 30, letterSpacing: 6, fontWeight: 700, color: PUBLIC, opacity: titleIn }}>
          PAINT
        </div>
        <div style={{ position: "absolute", top: 118, left: RIGHT_VIS - 120, fontSize: 30, letterSpacing: 6, fontWeight: 700, color: PUBLIC, opacity: titleIn }}>
          NUMBERS
        </div>
        <div style={{ position: "absolute", top: 166, left: 220, width: 1480, height: 3, background: "#2c3039", opacity: titleIn }} />

        {ROWS.map((row, i) => {
          const y = ROW0_Y + i * ROW_H;
          const a = rowIn(i);
          const r = rightIn(i);
          if (a <= 0) return null;
          return (
            <div key={i}>
              <div
                style={{
                  position: "absolute",
                  left: 220,
                  top: y - 50,
                  width: 1480,
                  height: 100,
                  borderRadius: 18,
                  background: "#1f2229",
                  opacity: active(i) ? a : 0,
                }}
              />
              <div style={{ opacity: a, transform: `translateX(${(1 - a) * -24}px)` }}>
                <div style={{ position: "absolute", left: LEFT_VIS - 50, top: y - 40, width: 120, height: 80 }}>{row.left}</div>
                <Label x={LEFT_LABEL} y={y}>
                  {row.leftLabel}
                </Label>
              </div>
              <div style={{ position: "absolute", left: EQ_X - 30, width: 60, top: y - 34, textAlign: "center", fontSize: 52, fontWeight: 800, color: MUTED, opacity: r }}>
                =
              </div>
              <div style={{ opacity: r, transform: `translateX(${(1 - r) * 24}px)` }}>
                <Centered x={RIGHT_VIS} y={y}>
                  {row.right}
                </Centered>
                <Label x={RIGHT_LABEL + 60} y={y}>
                  <span style={{ color: "#c9ccd2" }}>{row.rightLabel}</span>
                </Label>
              </div>
            </div>
          );
        })}
      </div>

      {/* The takeaway */}
      {frame >= FINAL_AT - 8 && (
        <div style={{ opacity: 1 - tableOut }}>
          <div style={{ position: "absolute", top: 170, width: "100%", textAlign: "center", fontSize: 70, fontWeight: 800, color: "#f4f4f5", lineHeight: 1.25 }}>
            <div style={{ opacity: line1 }}>Two strangers, talking in public,</div>
            <div style={{ opacity: line2 }}>
              end up sharing a <span style={{ color: LIGHT_BROWN, textShadow: `0 0 ${24 * glow}px ${LIGHT_BROWN}` }}>secret</span>.
            </div>
          </div>
          {[
            ["Alice", 600, ALICE],
            ["Bob", 1320, BOB],
          ].map(([name, x, color]) => (
            <div key={name} style={{ position: "absolute", left: x - 100, top: 520, width: 200, textAlign: "center", transform: `scale(${people})` }}>
              <div
                style={{
                  width: 130,
                  height: 130,
                  margin: "0 auto",
                  borderRadius: "50%",
                  background: "#23262e",
                  boxShadow: `0 0 0 7px ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 66,
                  fontWeight: 800,
                  color,
                }}
              >
                {name[0]}
              </div>
              <div style={{ marginTop: 14, fontSize: 40, fontWeight: 700, color: "#f4f4f5" }}>{name}</div>
            </div>
          ))}
          {[600, 1320].map((x) => (
            <Key
              key={x}
              x={x}
              y={790}
              size={140}
              color={LIGHT_BROWN}
              style={{ transform: `scale(${keys}) rotate(${(1 - keys) * -25}deg)`, filter: `drop-shadow(0 0 ${18 * glow}px ${LIGHT_BROWN})` }}
            />
          ))}
          <div style={{ position: "absolute", left: EQ_X - 200, top: 560, width: 400, textAlign: "center", whiteSpace: "nowrap", opacity: 0.55 * people }}>
            <div
              style={{
                width: 90,
                height: 90,
                margin: "0 auto",
                borderRadius: "50%",
                background: "#23262e",
                boxShadow: `0 0 0 5px ${MUTED}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 46,
                fontWeight: 800,
                color: MUTED,
              }}
            >
              E
            </div>
            <div style={{ marginTop: 12, fontSize: 32, color: MUTED }}>heard it all, no key</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
