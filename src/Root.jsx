import { Composition } from "remotion";
import { TestClip } from "./TestClip";
import { Hook } from "./scenes/Hook";
import { MixAndSwap, MIX_AND_SWAP_FRAMES } from "./scenes/MixAndSwap";
import { SameColour, SAME_COLOUR_FRAMES } from "./scenes/SameColour";
import { EveStuck, EVE_STUCK_FRAMES } from "./scenes/EveStuck";
import { Numbers, NUMBERS_FRAMES } from "./scenes/Numbers";
import { FullVideo, FULL_VIDEO_FRAMES } from "./FullVideo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="TestClip"
      component={TestClip}
      durationInFrames={150} // 5 seconds at 30 fps
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Hook"
      component={Hook}
      durationInFrames={285} // hook.wav is 8.45 s + ~1 s tail = 9.5 s at 30 fps
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="MixAndSwap"
      component={MixAndSwap}
      durationInFrames={MIX_AND_SWAP_FRAMES} // Scene 2, 11 s
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="SameColour"
      component={SameColour}
      durationInFrames={SAME_COLOUR_FRAMES} // Scene 3, 8 s
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="EveStuck"
      component={EveStuck}
      durationInFrames={EVE_STUCK_FRAMES} // Scene 4, 8.5 s
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Numbers"
      component={Numbers}
      durationInFrames={NUMBERS_FRAMES} // Scene 5, 20 s
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="FullVideo"
      component={FullVideo}
      durationInFrames={FULL_VIDEO_FRAMES} // all finished scenes in order
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
