import {
  AbsoluteFill,
  Audio,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PUBLIC = "#f2c14e"; // shared public paint (yellow)
const ALICE_SECRET = "#e4572e"; // Alice's secret (red)
const BOB_SECRET = "#2e86ab"; // Bob's secret (blue)

const Person = ({ name, x, secret, frame, fps }) => {
  const pop = spring({ frame, fps, config: { damping: 12 } });
  // Secret drop falls into the public paint between 1.2s and 2.4s, then the pot mixes.
  const drop = interpolate(frame, [36, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mix = interpolate(frame, [66, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const potColor = interpolateColors(mix, [0, 1], [PUBLIC, mixColor(PUBLIC, secret)]);

  return (
    <div style={{ position: "absolute", left: x - 160, top: 300, width: 320, textAlign: "center", transform: `scale(${pop})` }}>
      <div style={{ fontSize: 56, fontWeight: 700, color: "#f5f5f5", marginBottom: 40 }}>{name}</div>
      {/* secret drop */}
      <div
        style={{
          position: "absolute",
          left: 135,
          top: 110 + drop * 150,
          width: 50,
          height: 50,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          background: secret,
          opacity: 1 - mix,
        }}
      />
      {/* paint pot */}
      <div
        style={{
          margin: "190px auto 0",
          width: 220,
          height: 160,
          borderRadius: "0 0 110px 110px",
          background: potColor,
          boxShadow: "0 0 0 8px #3a3f4b",
        }}
      />
    </div>
  );
};

// Simple average, enough to suggest paint mixing.
function mixColor(a, b) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r, g, bl] = p(a).map((v, i) => Math.round((v + p(b)[i]) / 2));
  return `rgb(${r}, ${g}, ${bl})`;
}

export const TestClip = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const caption = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eve = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#15171c", fontFamily: "Segoe UI, Helvetica, Arial, sans-serif" }}>
      <Audio src={staticFile("narration.wav")} />

      <div style={{ position: "absolute", top: 80, width: "100%", textAlign: "center", fontSize: 72, fontWeight: 800, color: "#f5f5f5" }}>
        Diffie–Hellman Key Exchange
      </div>

      <Person name="Alice" x={width * 0.25} secret={ALICE_SECRET} frame={frame} fps={fps} />
      <Person name="Bob" x={width * 0.75} secret={BOB_SECRET} frame={frame - 6} fps={fps} />

      {/* Eve, listening in the middle */}
      <div style={{ position: "absolute", left: width / 2 - 200, top: 420, width: 400, textAlign: "center", opacity: eve }}>
        <div style={{ fontSize: 120 }}>👂</div>
        <div style={{ fontSize: 40, color: "#9aa0ad" }}>Eve is listening</div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 90,
          width: "100%",
          textAlign: "center",
          fontSize: 54,
          color: "#f5f5f5",
          opacity: caption,
          transform: `translateY(${(1 - caption) * 20}px)`,
        }}
      >
        A shared secret — built in public.
      </div>
    </AbsoluteFill>
  );
};
