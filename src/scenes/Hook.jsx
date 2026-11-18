import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Palette shared with TestClip
const BG = "#15171c";
const TEXT = "#f5f5f5";
const MUTED = "#9aa0ad";
const PUBLIC = "#f2c14e"; // public values (yellow)
const ALICE = "#e4572e"; // Alice's secret (red)
const BOB = "#2e86ab"; // Bob's secret (blue)
const SHARED = "#8b6fd6"; // the shared key (purple = red + blue)
const FONT = "Segoe UI, Helvetica, Arial, sans-serif";

// Layout
const ALICE_X = 330;
const BOB_X = 1590;
const LINE_Y = 430;
const EVE_X = 960;
const EVE_Y = 700;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

// Real toy Diffie–Hellman numbers (p = 23, g = 5, a = 6, b = 15 -> key 2).
// Each message: label, start frame, direction (1 = Alice -> Bob, -1 = Bob -> Alice).
const MESSAGES = [
  { label: "p = 23", start: 36, dir: 1 },
  { label: "g = 5", start: 58, dir: -1 },
  { label: "A = 8", start: 96, dir: 1 },
  { label: "B = 19", start: 118, dir: -1 },
];
const TRAVEL = 32; // frames to cross the channel
const KEY_FRAME = 165; // keys appear ("...end up sharing a secret")

const Avatar = ({ name, x, color, frame, fps }) => {
  const pop = spring({ frame, fps, config: { damping: 12 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 130,
        top: LINE_Y - 130,
        width: 260,
        textAlign: "center",
        transform: `scale(${pop})`,
      }}
    >
      <div
        style={{
          width: 180,
          height: 180,
          margin: "40px auto 0",
          borderRadius: "50%",
          background: "#23262e",
          boxShadow: `0 0 0 8px ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 90,
          fontWeight: 800,
          color,
        }}
      >
        {name[0]}
      </div>
      <div style={{ marginTop: 26, fontSize: 52, fontWeight: 700, color: TEXT }}>{name}</div>
    </div>
  );
};

const Key = ({ color, size = 120 }) => (
  <svg width={size} height={size / 2} viewBox="0 0 120 60">
    <circle cx="22" cy="30" r="18" fill="none" stroke={color} strokeWidth="9" />
    <rect x="38" y="25" width="76" height="10" rx="3" fill={color} />
    <rect x="92" y="33" width="9" height="16" rx="2" fill={color} />
    <rect x="76" y="33" width="9" height="12" rx="2" fill={color} />
  </svg>
);

const MessagePill = ({ label, style }) => (
  <div
    style={{
      position: "absolute",
      padding: "10px 22px",
      borderRadius: 16,
      background: PUBLIC,
      color: BG,
      fontSize: 34,
      fontWeight: 700,
      whiteSpace: "nowrap",
      transform: "translate(-50%, -50%)",
      boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    {label}
  </div>
);

export const Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Public channel draws itself from the middle outwards.
  const lineDraw = interpolate(frame, [12, 38], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lineLeft = EVE_X - (EVE_X - ALICE_X - 110) * lineDraw;
  const lineRight = EVE_X + (BOB_X - EVE_X - 110) * lineDraw;
  const channelLabel = interpolate(frame, [30, 45], [0, 1], clamp);

  // Eve fades/slides in as the first message reaches the middle.
  const eveIn = spring({ frame: frame - 50, fps, config: { damping: 14 } });

  // Text beats
  const beat1 = interpolate(frame, [70, 85], [0, 1], clamp);
  const beat2 = interpolate(frame, [KEY_FRAME - 10, KEY_FRAME + 5], [0, 1], clamp);

  // Keys
  const keyPop = spring({ frame: frame - KEY_FRAME, fps, config: { damping: 10 } });
  const eveConfused = interpolate(frame, [KEY_FRAME + 15, KEY_FRAME + 30], [0, 1], clamp);

  // Messages Eve has copied so far (each copy lands ~12 frames after crossing the middle).
  const copied = MESSAGES.filter((m) => frame >= m.start + TRAVEL / 2 + 12);

  const fadeOut = interpolate(frame, [270, 285], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, opacity: fadeOut }}>
      <Audio src={staticFile("hook.wav")} />

      {/* Public channel */}
      <div
        style={{
          position: "absolute",
          left: lineLeft,
          width: lineRight - lineLeft,
          top: LINE_Y - 5,
          height: 10,
          borderRadius: 5,
          background: PUBLIC,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: LINE_Y - 100,
          width: "100%",
          textAlign: "center",
          fontSize: 32,
          letterSpacing: 6,
          color: PUBLIC,
          opacity: channelLabel * 0.8,
        }}
      >
        PUBLIC CHANNEL
      </div>

      {/* Copy stream from the channel down to Eve */}
      {MESSAGES.map((m) => {
        const t = frame - (m.start + TRAVEL / 2);
        const p = interpolate(t, [0, 14], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        if (t < 0 || t > 14) return null;
        return (
          <MessagePill
            key={`copy-${m.label}`}
            label={m.label}
            style={{
              left: EVE_X,
              top: LINE_Y + p * (EVE_Y - 40 - LINE_Y),
              opacity: 0.75 * (1 - p * 0.6),
              transform: `translate(-50%, -50%) scale(${1 - p * 0.35})`,
            }}
          />
        );
      })}

      {/* Messages travelling along the channel */}
      {MESSAGES.map((m) => {
        const t = interpolate(frame, [m.start, m.start + TRAVEL], [0, 1], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        });
        if (frame < m.start || frame > m.start + TRAVEL + 6) return null;
        const from = m.dir === 1 ? ALICE_X + 120 : BOB_X - 120;
        const to = m.dir === 1 ? BOB_X - 120 : ALICE_X + 120;
        const arrive = interpolate(frame, [m.start + TRAVEL, m.start + TRAVEL + 6], [1, 0], clamp);
        const depart = interpolate(frame, [m.start, m.start + 6], [0, 1], clamp);
        return (
          <MessagePill
            key={m.label}
            label={m.label}
            style={{
              left: from + (to - from) * t,
              top: LINE_Y,
              opacity: Math.min(arrive, depart),
              transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * depart})`,
            }}
          />
        );
      })}

      <Avatar name="Alice" x={ALICE_X} color={ALICE} frame={frame} fps={fps} />
      <Avatar name="Bob" x={BOB_X} color={BOB} frame={frame - 6} fps={fps} />

      {/* Eve and her notebook of copied messages */}
      <div
        style={{
          position: "absolute",
          left: EVE_X - 260,
          top: EVE_Y - 30,
          width: 520,
          textAlign: "center",
          opacity: eveIn,
          transform: `translateY(${(1 - eveIn) * 40}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            minHeight: 54,
            padding: "10px 16px",
            borderRadius: 14,
            border: `3px dashed ${MUTED}`,
          }}
        >
          {copied.map((m) => (
            <div
              key={m.label}
              style={{ padding: "4px 12px", borderRadius: 10, background: "#3a3f4b", color: PUBLIC, fontSize: 28, fontWeight: 700 }}
            >
              {m.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, fontSize: 44, fontWeight: 700, color: TEXT }}>
          Eve{" "}
          <span style={{ color: MUTED, fontWeight: 400 }}>
            {eveConfused > 0.5 ? "has it all… but no key" : "copies everything"}
          </span>
        </div>
      </div>

      {/* Shared keys above Alice and Bob */}
      {[ALICE_X, BOB_X].map((x) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: x - 70,
            top: LINE_Y - 250,
            transform: `scale(${keyPop}) rotate(${(1 - keyPop) * -30}deg)`,
            filter: `drop-shadow(0 0 ${18 * keyPop}px ${SHARED})`,
          }}
        >
          <Key color={SHARED} size={140} />
        </div>
      ))}

      {/* Text beats */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          width: "100%",
          textAlign: "center",
          fontSize: 58,
          color: TEXT,
        }}
      >
        <span style={{ opacity: beat1 }}>Everyone can hear everything…</span>{" "}
        <span style={{ opacity: beat2, color: SHARED, fontWeight: 700 }}>yet they share a secret.</span>
      </div>
    </AbsoluteFill>
  );
};
