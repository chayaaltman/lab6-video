// The whole explainer: every finished scene back to back.
// Add new scenes to SCENES in order; FULL_VIDEO_FRAMES updates itself.
import { Series } from "remotion";
import { Hook } from "./scenes/Hook";
import { MixAndSwap, MIX_AND_SWAP_FRAMES } from "./scenes/MixAndSwap";
import { SameColour, SAME_COLOUR_FRAMES } from "./scenes/SameColour";
import { EveStuck, EVE_STUCK_FRAMES } from "./scenes/EveStuck";
import { Numbers, NUMBERS_FRAMES } from "./scenes/Numbers";
import { Clock, CLOCK_FRAMES } from "./scenes/Clock";

const SCENES = [
  { component: Hook, frames: 285 }, // Scene 1
  { component: MixAndSwap, frames: MIX_AND_SWAP_FRAMES }, // Scene 2
  { component: SameColour, frames: SAME_COLOUR_FRAMES }, // Scene 3
  { component: EveStuck, frames: EVE_STUCK_FRAMES }, // Scene 4
  { component: Numbers, frames: NUMBERS_FRAMES }, // Scene 5
  { component: Clock, frames: CLOCK_FRAMES }, // Scene 6
];

export const FULL_VIDEO_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0);

export const FullVideo = () => (
  <Series>
    {SCENES.map(({ component: Scene, frames }, i) => (
      <Series.Sequence key={i} durationInFrames={frames}>
        <Scene />
      </Series.Sequence>
    ))}
  </Series>
);
