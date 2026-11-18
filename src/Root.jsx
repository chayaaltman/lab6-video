import { Composition } from "remotion";
import { TestClip } from "./TestClip";
import { Hook } from "./scenes/Hook";
import { MixAndSwap, MIX_AND_SWAP_FRAMES } from "./scenes/MixAndSwap";

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
  </>
);
