// Palette and building blocks shared by every scene (see SCRIPT.md "Visual style").
import { spring } from "remotion";

export const BG = "#15171c";
export const TEXT = "#f4f4f5";
export const MUTED = "#8a8f98"; // Eve and anything she can see
export const PUBLIC = "#f2c14e"; // yellow
export const ALICE = "#e4572e"; // red, Alice's secret
export const BOB = "#2e86ab"; // blue, Bob's secret
export const ORANGE = "#eb8c3e"; // yellow + red, Alice's public mixture
export const GREEN = "#8fa37d"; // yellow + blue, Bob's public mixture
export const BROWN = "#7a4e2d"; // all three, the shared secret
export const FONT = "Segoe UI, Helvetica, Arial, sans-serif";

export const W = 1920;
export const ALICE_X = 330;
export const BOB_X = 1590;
export const EVE_X = 960;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

export const pop = (frame, fps, delay = 0, damping = 12) =>
  spring({ frame: frame - delay, fps, config: { damping } });

// A person: coloured ring with their initial, name underneath. (x, y) is the circle centre.
export const Person = ({ name, x, y, color, size = 150, scale = 1, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x - 150,
      top: y - size / 2,
      width: 300,
      textAlign: "center",
      transform: `scale(${scale})`,
      opacity,
    }}
  >
    <div
      style={{
        width: size,
        height: size,
        margin: "0 auto",
        borderRadius: "50%",
        background: "#23262e",
        boxShadow: `0 0 0 7px ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        fontWeight: 800,
        color,
      }}
    >
      {name[0]}
    </div>
    <div style={{ marginTop: 16, fontSize: 44, fontWeight: 700, color: TEXT }}>{name}</div>
  </div>
);

// A paint pot drawn in SVG. (x, y) is the pot's centre. `outline` draws Eve's grey-outlined copy style.
export const Pot = ({ x, y, color, width = 200, label, labelColor = TEXT, outline = false, style = {} }) => {
  const h = width * 0.72;
  return (
    <div style={{ position: "absolute", left: x - width / 2, top: y - h / 2, width, height: h, ...style }}>
      <svg width={width} height={h} viewBox="0 0 200 144" style={{ overflow: "visible" }}>
        {/* paint */}
        <path d="M14 30 H186 L170 122 Q166 140 148 140 H52 Q34 140 30 122 Z" fill={color} />
        {/* rim */}
        <rect x="4" y="18" width="192" height="18" rx="9" fill={outline ? "none" : "#3a3f4b"} stroke={outline ? MUTED : "none"} strokeWidth="6" />
        {outline && (
          <path d="M14 30 H186 L170 122 Q166 140 148 140 H52 Q34 140 30 122 Z" fill="none" stroke={MUTED} strokeWidth="6" />
        )}
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            top: h + 8,
            width: "100%",
            textAlign: "center",
            fontSize: Math.max(24, width * 0.16),
            fontWeight: 700,
            letterSpacing: 2,
            color: labelColor,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

// A teardrop of paint; (x, y) is its centre.
export const Drop = ({ x, y, color, size = 46, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: "50% 50% 50% 0",
      transform: "rotate(-45deg)",
      background: color,
      opacity,
    }}
  />
);

// Bottom caption that fades in and out over [from, to].
export const Caption = ({ frame, from, to, children, color = TEXT }) => {
  const o = Math.min(
    Math.max(0, Math.min(1, (frame - from) / 12)),
    Math.max(0, Math.min(1, (to - frame) / 12))
  );
  return (
    <div
      style={{
        position: "absolute",
        bottom: 56,
        width: "100%",
        textAlign: "center",
        fontSize: 54,
        color,
        opacity: o,
        transform: `translateY(${(1 - o) * 16}px)`,
      }}
    >
      {children}
    </div>
  );
};
