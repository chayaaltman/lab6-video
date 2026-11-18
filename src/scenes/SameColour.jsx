// Scene 3 — Same final colour (SCRIPT.md). 8 s at 30 fps.
// Starts where Scene 2 ends: Alice holds Bob's green mixture, Bob holds Alice's orange one.
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

export const SAME_COLOUR_FRAMES = 240;

// Narration timing (frames). s3-a 2.40 s, s3-b 3.65 s.
const A_AT = 12; // "Each adds their own secret again."
const B_AT = 96; // "Both get the same brown, and it never crossed the wire."

// Beats
const DROPS = [38, 62]; // both secret drops fall together ("...secret again")
const MIX = [62, 92];
const EQUALS_AT = 112; // "same brown"
const KEYS_AT = 126;
const CROSS_AT = 160; // "never crossed the wire"

// Layout (same as Scene 2)
const PERSON_Y = 220;
const POT_Y = 500;
const KEY_Y = 625;
const EVE_Y = 850;
const TRAY_Y = 735;
const ALICE_SECRET_X = 110;
const BOB_SECRET_X = 1810;
const LIGHT_BROWN = "#a8703f"; // glow colour for the brown

export const SameColour = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 10], [0, 1], clamp);
  const fadeOut = interpolate(frame, [226, 240], [1, 0], clamp);

  // Drops arc from each secret jar into the pot in front of its owner.
  const drop = (fromX, toX) => {
    const t = interpolate(frame, DROPS, [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return { x: fromX + (toX - fromX) * t, y: POT_Y - 70 - Math.sin(t * Math.PI) * 120 + t * 40, t };
  };
  const aDrop = drop(ALICE_SECRET_X, ALICE_X);
  const bDrop = drop(BOB_SECRET_X, BOB_X);

  const mix = interpolate(frame, MIX, [0, 1], clamp);
  const aliceColor = interpolateColors(mix, [0, 1], [GREEN, BROWN]);
  const bobColor = interpolateColors(mix, [0, 1], [ORANGE, BROWN]);
  const splash = Math.sin(Math.min(mix * 2, 1) * Math.PI) * 0.08;

  // Glow on the two brown pots once they match
  const glow = interpolate(frame, [EQUALS_AT - 6, EQUALS_AT + 10], [0, 1], clamp);
  const pulse = glow * (0.75 + 0.25 * Math.sin((frame - EQUALS_AT) / 6));
  const potGlow = `drop-shadow(0 0 ${28 * pulse}px ${LIGHT_BROWN})`;

  const equals = pop(frame, fps, EQUALS_AT, 10);
  const keys = pop(frame, fps, KEYS_AT, 10);
  const cross = pop(frame, fps, CROSS_AT, 9);
  const crossFlicker = frame >= CROSS_AT && frame < CROSS_AT + 14 ? (Math.floor((frame - CROSS_AT) / 3) % 2 ? 0.35 : 1) : 1;

  const eveNote = interpolate(frame, [CROSS_AT + 16, CROSS_AT + 30], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, opacity: fadeOut }}>
      <Sequence from={A_AT}>
        <Audio src={staticFile("s3-a.wav")} />
      </Sequence>
      <Sequence from={B_AT}>
        <Audio src={staticFile("s3-b.wav")} />
      </Sequence>

      {/* Public channel */}
      <div
        style={{
          position: "absolute",
          left: ALICE_X + 130,
          width: BOB_X - ALICE_X - 260,
          top: POT_Y - 4,
          height: 8,
          borderRadius: 4,
          background: PUBLIC,
          opacity: 0.35 * enter,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: POT_Y - 56,
          width: "100%",
          textAlign: "center",
          fontSize: 26,
          letterSpacing: 6,
          color: PUBLIC,
          opacity: 0.7 * enter * (1 - Math.min(1, cross)),
        }}
      >
        PUBLIC CHANNEL
      </div>

      {/* "never crossed the wire" */}
      <div
        style={{
          position: "absolute",
          left: EVE_X - 40,
          top: POT_Y - 40,
          width: 80,
          height: 80,
          transform: `scale(${cross})`,
          opacity: crossFlicker,
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill={BG} stroke={MUTED} strokeWidth="5" />
          <path d="M24 24 L56 56 M56 24 L24 56" stroke={MUTED} strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          top: POT_Y + 50,
          width: "100%",
          textAlign: "center",
          fontSize: 30,
          color: MUTED,
          opacity: cross,
        }}
      >
        the <span style={{ color: LIGHT_BROWN, fontWeight: 700 }}>brown</span> never travels here
      </div>

      <Person name="Alice" x={ALICE_X} y={PERSON_Y} color={ALICE} opacity={enter} />
      <Person name="Bob" x={BOB_X} y={PERSON_Y} color={BOB} opacity={enter} />

      {/* Big "=" between them, top centre */}
      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          textAlign: "center",
          fontSize: 150,
          fontWeight: 800,
          lineHeight: 1,
          color: LIGHT_BROWN,
          transform: `scale(${equals})`,
          textShadow: `0 0 ${30 * pulse}px ${LIGHT_BROWN}`,
        }}
      >
        =
      </div>

      {/* Secret jars */}
      <Pot x={ALICE_SECRET_X} y={POT_Y} width={110} color={ALICE} label="secret" labelColor={ALICE} style={{ opacity: enter }} />
      <Pot x={BOB_SECRET_X} y={POT_Y} width={110} color={BOB} label="secret" labelColor={BOB} style={{ opacity: enter }} />

      {/* The received mixtures, turning brown */}
      <Pot x={ALICE_X} y={POT_Y} width={200} color={aliceColor} style={{ opacity: enter, transform: `scale(${1 + splash})`, filter: potGlow }} />
      <Pot x={BOB_X} y={POT_Y} width={200} color={bobColor} style={{ opacity: enter, transform: `scale(${1 + splash})`, filter: potGlow }} />

      {/* Keys under each pot */}
      {[ALICE_X, BOB_X].map((x) => (
        <Key
          key={x}
          x={x}
          y={KEY_Y}
          size={130}
          color={LIGHT_BROWN}
          style={{ transform: `scale(${keys}) rotate(${(1 - keys) * -25}deg)`, filter: `drop-shadow(0 0 ${16 * pulse}px ${LIGHT_BROWN})` }}
        />
      ))}

      {aDrop.t > 0 && aDrop.t < 1 && <Drop x={aDrop.x} y={aDrop.y} color={ALICE} />}
      {bDrop.t > 0 && bDrop.t < 1 && <Drop x={bDrop.x} y={bDrop.y} color={BOB} />}

      {/* Eve's tray: what she copied in Scene 2 */}
      <div
        style={{
          position: "absolute",
          left: EVE_X - 230,
          top: TRAY_Y - 58,
          width: 460,
          height: 116,
          borderRadius: 18,
          border: `3px dashed ${MUTED}`,
          opacity: enter,
        }}
      />
      {[PUBLIC, ORANGE, GREEN].map((c, i) => (
        <Pot key={c} x={EVE_X - 140 + i * 140} y={TRAY_Y - 6} width={90} color={c} outline style={{ opacity: enter }} />
      ))}

      {/* Eve */}
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
          opacity: enter,
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
          }}
        >
          E
        </div>
        <div style={{ fontSize: 40, color: MUTED, position: "relative" }}>
          <span style={{ opacity: 1 - eveNote }}>
            <b style={{ color: "#c9ccd2" }}>Eve</b> sees everything public
          </span>
          <span style={{ position: "absolute", left: 0, whiteSpace: "nowrap", opacity: eveNote }}>
            <b style={{ color: "#c9ccd2" }}>Eve</b> has no <span style={{ color: LIGHT_BROWN, fontWeight: 700 }}>brown</span>
          </span>
        </div>
      </div>

      <Caption frame={frame} from={A_AT} to={B_AT - 4}>
        Each adds their <span style={{ color: ALICE, fontWeight: 700 }}>own</span>{" "}
        <span style={{ color: BOB, fontWeight: 700 }}>secret</span> again
      </Caption>
      <Caption frame={frame} from={B_AT} to={240}>
        Same <span style={{ color: LIGHT_BROWN, fontWeight: 700 }}>brown</span> on both sides
      </Caption>
    </AbsoluteFill>
  );
};
