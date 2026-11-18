// Generate narration audio with Kokoro TTS.
// Usage: node scripts/narrate.mjs "Your sentence here." public/narration.wav [voice]
import { KokoroTTS } from "kokoro-js";
import { env } from "@huggingface/transformers";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

// Keep the model cache at a short path: Windows can't load files whose path is > 260 chars.
env.cacheDir = join(homedir(), ".cache", "kokoro");

const text = process.argv[2] ?? "Two strangers can agree on a secret, while everyone is listening.";
const out = process.argv[3] ?? "public/narration.wav";
const voice = process.argv[4] ?? "af_heart";

const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
  dtype: "q8", // ~90 MB model, downloaded and cached on first run
  device: "cpu",
});

const audio = await tts.generate(text, { voice });
mkdirSync(dirname(out), { recursive: true });
audio.save(out);
console.log(`Saved ${out} (${(audio.audio.length / audio.sampling_rate).toFixed(2)} s)`);
