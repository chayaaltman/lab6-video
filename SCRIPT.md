# Lab 6 — Diffie–Hellman in One Minute: Script

## Goal (one sentence)

After one minute, a viewer should understand that two people can agree on a shared secret key while an eavesdropper hears everything they send, because each mixes a private secret into a public value and swaps the result; mixing is easy but un-mixing is practically impossible (in the real version, reversing modular exponentiation is the discrete logarithm problem).

## Visual style

| Token | Hex | Meaning |
|---|---|---|
| Background | `#15171c` | every scene |
| Yellow | `#f2c14e` | **public** (the shared starting paint, the public numbers 5 and 23) |
| Red | `#e4572e` | **Alice's secret** (her paint, her number 6) |
| Blue | `#2e86ab` | **Bob's secret** (his paint, his number 15) |
| Grey | `#8a8f98` | **Eve** and anything she can see |
| Orange (yellow+red) | `#eb8c3e` | Alice's public mixture / the number 8 |
| Green (yellow+blue) | `#8fa37d` | Bob's public mixture / the number 19 |
| Brown (all three) | `#7a4e2d` | the final shared secret / the number 2 |
| Text | `#f4f4f5` | captions and numbers (Inter or similar sans, bold) |

- Layout constant across scenes: **Alice on the left** (x ≈ 360), **Bob on the right** (x ≈ 1560), **Eve in the middle** (x ≈ 960, slightly lower, grey, with a big ear / headphones icon). Reuse the characters and paint pots from `src/TestClip.jsx`.
- A thin grey horizontal line between Alice and Bob at y ≈ 540 is "the public channel". Anything that travels along it passes *over Eve's head* and she gets a grey copy (a small grey ghost of the item drops into a tray in front of her).
- Numbers keep the colour of what they mean: public numbers yellow, secrets red/blue, exchanged values orange/green, final key brown with a glow.
- Motion: springs for things appearing (`spring({fps, frame, config:{damping: 14}})`), `interpolate` for travel along the channel (~20 frames per trip), a soft "lock" glow on the final shared secret.
- 1920×1080 @ 30 fps. Scene times below are approximate; final timing should follow the generated audio length of each scene.

## Voice

Kokoro TTS, voice **`af_heart`**, normal speed (≈ 2.5 words / second). One audio file per scene via `scripts/narrate.mjs`; leave ~0.5 s of silence after each scene. Narration text is written for TTS: numbers spelled out, no symbols.

---

## Scene 1 — Hook (0:00–0:09)

**On screen**
- Fade in on the dark background. Alice (left) and Bob (right) spring in. The grey channel line draws itself left-to-right between them (frames 0–20).
- Eve slides up from the bottom into the middle, below the line, and her ear icon pulses.
- A small speech bubble ("hi") travels Alice → Bob along the line; a grey copy drops to Eve. Repeat once Bob → Alice.
- On "secret key", a small brown key icon with a question mark appears floating between Alice and Bob, above the line, then fades to 40% opacity (a promise of what is coming).

**Narration**
> Alice and Bob have never met, and Eve hears every word they send. Yet they will agree on a secret key.

## Scene 2 — Mix and swap (0:09–0:19)

**On screen**
- The key icon fades out. A big yellow pot appears in the middle above the line with the label "public". Two copies of it slide out: one to Alice, one to Bob. Eve also gets a grey-outlined yellow copy (she knows the public paint).
- On "her secret red": a red drop falls into Alice's pot; the pot colour animates from yellow to orange (`interpolateColors`). A small red "secret" pot stays hidden behind Alice (only she and the viewer see it; Eve does not get a copy).
- On "his secret blue": same for Bob, yellow → green.
- On "swap": the orange pot travels left → right, the green pot right → left, crossing in the middle over the line. As they pass over Eve, grey-outlined copies of orange and green drop into her tray.

**Narration**
> Start with public yellow paint. Alice mixes in her secret red, and Bob his secret blue. They swap the mixtures in the open.

## Scene 3 — Same final colour (0:19–0:26)

**On screen**
- Alice now holds Bob's green pot; Bob holds Alice's orange pot.
- Alice adds a red drop to green → brown. Bob adds a blue drop to orange → brown. Both animations run at the same time so they land together.
- The two brown pots glow, and an "=" sign springs in between them. A brown key icon appears over each pot.
- A short grey "✕" flickers on the channel line to show the brown never travelled along it.

**Narration**
> Each adds their own secret again. Both get the same brown, and it never crossed the wire.

## Scene 4 — Why Eve is stuck (0:26–0:32)

**On screen**
- Camera (scale) pushes toward Eve. Her tray shows yellow, orange and green.
- Left side of the frame: a short arrow "yellow + red → orange" plays quickly and cleanly (easy).
- Then try the reverse: an arrow from orange back toward separate yellow and red drops; the orange blob wobbles, and the arrow cracks and fades. A grey caption: "un-mixing?"
- Eve shrugs; the brown key stays out of her reach.

**Narration**
> Eve has every mixture, but mixing is easy, and un-mixing is practically impossible.

## Scene 5 — The real version, with numbers (0:32–0:49)

**On screen**
- Pots morph into rounded number cards (same colours). Layout stays: Alice left, Bob right, Eve middle.
- Top centre, yellow cards: **g = 5** and **p = 23**, labelled "public". Eve's tray gets grey copies.
- Alice: red card **a = 6** (secret). Under it the line `5⁶ mod 23 = 8` writes on; the **8** is an orange card.
- Bob: blue card **b = 15** (secret). Under it `5¹⁵ mod 23 = 19`; the **19** is a green card.
- Swap: the 8 travels to Bob, the 19 to Alice, over Eve (grey copies of 8 and 19 drop into her tray).
- Alice: `19⁶ mod 23 = 2`. Bob: `8¹⁵ mod 23 = 2`. Both **2** cards turn brown and glow with the key icon, "=" between them, exactly echoing Scene 3.
- Eve's tray now reads: 5, 23, 8, 19 — no 6, no 15, no 2.

**Narration**
> With numbers, everyone knows five and twenty three. Alice keeps six secret and sends five to the sixth, mod twenty three, which is eight. Bob keeps fifteen and sends nineteen. Each raises what they receive to their own secret. Both get two.

## Scene 6 — Clock arithmetic: one-way (0:49–0:57)

**On screen**
- A clock face with 23 positions (0–22) fades in at centre, ticks in grey, labels in `#f4f4f5`.
- A yellow pointer hops through the powers of 5, one hop every ~4 frames, leaving a fading trail and the exponent above each landing: 5¹ → 5, 5² → 2, 5³ → 10, 5⁴ → 4, 5⁵ → 20, 5⁶ → 8. The hops look scattered, not orderly. Caption on the left: "forward: easy".
- Then Eve's grey version: the target **8** is highlighted, and a grey counter tries exponents 1, 2, 3, ... with each wrong landing flashing ✕. Caption on the right: "backward: the discrete logarithm problem". (For the record, the full cycle of 5 mod 23 is 5, 2, 10, 4, 20, 8, 17, 16, 11, 9, 22, 18, 21, 13, 19, 3, 15, 6, 7, 12, 14, 1, so only exponent 6 in the range 1 to 22 lands on 8 and only 15 lands on 19.)

**Narration**
> Mod is clock arithmetic. Forward is quick, but answers jump around, so going backward, the discrete logarithm problem, means guessing.

## Scene 7 — Scale and closing (0:57–1:08)

**On screen**
- The clock shrinks into a dot and a wall of tiny digits floods the screen (a 617-digit number, about the size of a 2048-bit value), in dim grey with the clock's 23 replaced by it. A grey "no computer can undo this" stamp.
- Cut to a simple browser address bar with a padlock and `https://`; the padlock is brown and glows like the shared key.
- Final shot: pull back to the full Scene 3 composition — Alice and Bob each with the brown key, Eve in the middle with only yellow, orange and green. Title text fades in: "Mixing is easy. Un-mixing is impossible." Fade to background.

**Narration**
> Real keys have over six hundred digits, and your browser does this on every secure website. Everything was public, yet the key stayed secret.

---

## Word count and timing (≈ 2.5 words / second)

| Scene | Name | Words | Est. speech |
|---|---|---|---|
| 1 | Hook | 21 | 8.4 s |
| 2 | Mix and swap | 23 | 9.2 s |
| 3 | Same final colour | 17 | 6.8 s |
| 4 | Why Eve is stuck | 13 | 5.2 s |
| 5 | Real version with numbers | 42 | 16.8 s |
| 6 | Clock arithmetic | 20 | 8.0 s |
| 7 | Scale and closing | 24 | 9.6 s |
| **Total** | | **160** | **64.0 s** speech; ≈ 68 s with ~0.5 s of air per scene |

## Verified arithmetic

Checked with a BigInt modular-power function in Node (`node -e`):

- 5⁶ mod 23 = 15625 mod 23 = **8** (A, Alice sends)
- 5¹⁵ mod 23 = **19** (B, Bob sends)
- 19⁶ mod 23 = **2** (Alice's key) and 8¹⁵ mod 23 = **2** (Bob's key): match
- Powers of 5 mod 23 for exponents 1–22: 5, 2, 10, 4, 20, 8, 17, 16, 11, 9, 22, 18, 21, 13, 19, 3, 15, 6, 7, 12, 14, 1 (5 is a generator; exponent 6 is the only one in 1–22 giving 8).
- 2²⁰⁴⁸ has 617 decimal digits, so "over six hundred digits" is correct.
