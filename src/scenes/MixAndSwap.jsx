// Scene 2 — Mix and swap (SCRIPT.md). 11 s at 30 fps.
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
  Caption,
  Drop,
  EVE_X,
  FONT,
  GREEN,
  MUTED,
  ORANGE,
  PUBLIC,
  Person,
  Pot,
  clamp,
  pop,
} from "../shared";

export const MIX_AND_SWAP_FRAMES = 330;

// Narration timing (frames). s2-a 2.27 s, s2-b 4.10 s, s2-c 2.52 s.
const A_AT = 10; // "Start with public yellow paint."
const B_AT = 88; // "Alice mixes in her secret red, and Bob his secret blue."
const C_AT = 221; // "They swap the mixtures in the open."

// Beats
const COPY = [40, 70]; // public paint copies slide out
const ALICE_DROP = [104, 130]; // "...her secret red"
const BOB_DROP = [160, 186]; // "...his secret blue"
const MIX_LEN = 26;
const SWAP = [234, 290]; // "swap"

// Layout
const PERSON_Y = 220;
const POT_Y = 500; // pot centres, and the public channel
const PUBLIC_Y = 250;
const EVE_Y = 850;
const TRAY_Y = 735;
const ALICE_SECRET_X = 110;
const BOB_SECRET_X = 1810;

const ease = Easing.inOut(Easing.cubic);

export const MixAndSwap = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 12], [0, 1], clamp);
  const fadeOut = interpolate(frame, [315, 330], [1, 0], clamp);

  // Public pot and its copies
  const publicIn = pop(frame, fps, 4, 14);
  const copyT = interpolate(frame, COPY, [0, 1], { ...clamp, easing: ease });
  const copiesVisible = frame >= COPY[0];

  // Secret jars appear just before each drop
  const aliceJar = pop(frame, fps, ALICE_DROP[0] - 14, 14);
  const bobJar = pop(frame, fps, BOB_DROP[0] - 14, 14);

  // Drops: arc from the jar into the player's pot
  const dropPos = (range, fromX, toX) => {
    const t = interpolate(frame, range, [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    return { x: fromX + (toX - fromX) * t, y: POT_Y - 70 - Math.sin(t * Math.PI) * 120 + t * 40, t };
  };
  const aDrop = dropPos(ALICE_DROP, ALICE_SECRET_X, ALICE_X);
  const bDrop = dropPos(BOB_DROP, BOB_SECRET_X, BOB_X);

  const aliceMix = interpolate(frame, [ALICE_DROP[1], ALICE_DROP[1] + MIX_LEN], [0, 1], clamp);
  const bobMix = interpolate(frame, [BOB_DROP[1], BOB_DROP[1] + MIX_LEN], [0, 1], clamp);
  const alicePotColor = interpolateColors(aliceMix, [0, 1], [PUBLIC, ORANGE]);
  const bobPotColor = interpolateColors(bobMix, [0, 1], [PUBLIC, GREEN]);
  const splash = (mix) => Math.sin(Math.min(mix * 2, 1) * Math.PI) * 0.08;

  // Swap: Alice's (orange) pot goes right, Bob's (green) goes left, crossing over Eve.
  const swapT = interpolate(frame, SWAP, [0, 1], { ...clamp, easing: ease });
  const lift = Math.sin(swapT * Math.PI); // orange arcs up, green dips down so they don't overlap
  const aliceSidePot = {
    x: ALICE_X + (BOB_X - ALICE_X) * swapT,
    y: POT_Y - lift * 50,
  };
  const bobSidePot = {
    x: BOB_X + (ALICE_X - BOB_X) * swapT,
    y: POT_Y + lift * 50,
  };

  // Things Eve has seen, landing in her tray.
  const crossAt = (SWAP[0] + SWAP[1]) / 2;
  const eveItems = [
    { color: PUBLIC, at: COPY[0] + 10 },
    { color: ORANGE, at: crossAt },
    { color: GREEN, at: crossAt + 4 },
  ];
  const DROP_LEN = 18;

  // Public channel
  const channel = interpolate(frame, [0, 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const channelGlow = interpolate(frame, [SWAP[0] - 6, SWAP[0] + 6, SWAP[1], SWAP[1] + 12], [0.35, 0.8, 0.8, 0.35], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT, opacity: fadeOut }}>
      <Sequence from={A_AT}>
        <Audio src={staticFile("s2-a.wav")} />
      </Sequence>
      <Sequence from={B_AT}>
        <Audio src={staticFile("s2-b.wav")} />
      </Sequence>
      <Sequence from={C_AT}>
        <Audio src={staticFile("s2-c.wav")} />
      </Sequence>

      {/* Public channel between the two pot positions */}
      <div
        style={{
          position: "absolute",
          left: EVE_X - (EVE_X - ALICE_X - 130) * channel,
          width: (BOB_X - ALICE_X - 260) * channel,
          top: POT_Y - 4,
          height: 8,
          borderRadius: 4,
          background: PUBLIC,
          opacity: channelGlow,
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
          opacity: channel * 0.7,
        }}
      >
        PUBLIC CHANNEL
      </div>

      <Person name="Alice" x={ALICE_X} y={PERSON_Y} color={ALICE} opacity={enter} />
      <Person name="Bob" x={BOB_X} y={PERSON_Y} color={BOB} opacity={enter} />

      {/* The big public pot, top centre */}
      <Pot
        x={EVE_X}
        y={PUBLIC_Y}
        width={210}
        color={PUBLIC}
        label="PUBLIC"
        labelColor={PUBLIC}
        style={{ transform: `scale(${publicIn})` }}
      />

      {/* Secret jars, only next to their owner */}
      <Pot x={ALICE_SECRET_X} y={POT_Y} width={110} color={ALICE} label="secret" labelColor={ALICE} style={{ transform: `scale(${aliceJar})` }} />
      <Pot x={BOB_SECRET_X} y={POT_Y} width={110} color={BOB} label="secret" labelColor={BOB} style={{ transform: `scale(${bobJar})` }} />

      {/* Eve */}
      <div
        style={{
          position: "absolute",
          left: EVE_X - 300,
          top: EVE_Y - 50,
          width: 600,
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
        <div style={{ fontSize: 40, color: MUTED }}>
          <b style={{ color: "#c9ccd2" }}>Eve</b> sees everything public
        </div>
      </div>

      {/* Eve's tray */}
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
      {eveItems.map((item, i) => {
        const t = interpolate(frame, [item.at, item.at + DROP_LEN], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
        if (frame < item.at) return null;
        const slotX = EVE_X - 140 + i * 140;
        const startY = item.color === PUBLIC ? PUBLIC_Y : POT_Y;
        return (
          <Pot
            key={i}
            x={EVE_X + (slotX - EVE_X) * t}
            y={startY + (TRAY_Y - 6 - startY) * t}
            width={110 - 20 * t}
            color={item.color}
            outline
            style={{ opacity: 0.4 + 0.6 * t }}
          />
        );
      })}

      {/* The players' pots: copies of the public pot until they mix, then swap */}
      {copiesVisible && (
        <>
          <Pot
            x={EVE_X + (aliceSidePot.x - EVE_X) * copyT}
            y={PUBLIC_Y + (aliceSidePot.y - PUBLIC_Y) * copyT}
            color={alicePotColor}
            width={200}
            style={{ transform: `scale(${1 + splash(aliceMix)})` }}
          />
          <Pot
            x={EVE_X + (bobSidePot.x - EVE_X) * copyT}
            y={PUBLIC_Y + (bobSidePot.y - PUBLIC_Y) * copyT}
            color={bobPotColor}
            width={200}
            style={{ transform: `scale(${1 + splash(bobMix)})` }}
          />
        </>
      )}

      {/* Secret drops */}
      {aDrop.t > 0 && aDrop.t < 1 && <Drop x={aDrop.x} y={aDrop.y} color={ALICE} />}
      {bDrop.t > 0 && bDrop.t < 1 && <Drop x={bDrop.x} y={bDrop.y} color={BOB} />}

      <Caption frame={frame} from={A_AT} to={B_AT - 4}>
        Everyone gets the <span style={{ color: PUBLIC, fontWeight: 700 }}>public</span> paint
      </Caption>
      <Caption frame={frame} from={B_AT} to={C_AT - 4}>
        Each mixes in a <span style={{ color: ALICE, fontWeight: 700 }}>secret</span>{" "}
        <span style={{ color: BOB, fontWeight: 700 }}>colour</span>
      </Caption>
      <Caption frame={frame} from={C_AT} to={330}>
        They swap the mixtures, in the open
      </Caption>
    </AbsoluteFill>
  );
};
