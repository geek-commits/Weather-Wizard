import type { SoundPreset } from "./types";

export const SOUND_PRESETS = {
  // Forecast selection — short upward acknowledgement 860→1040 sine
  select: {
    source: { type: "sine" as OscillatorType, frequency: { start: 860, end: 1040 } },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
    gain: 0.5,
  } satisfies SoundPreset,

  // Unit toggle — two-note ascending / descending
  toggleOn: {
    layers: [
      {
        source: { type: "sine" as OscillatorType, frequency: 520 },
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 },
        gain: 0.42,
      },
      {
        source: { type: "sine" as OscillatorType, frequency: 760 },
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 },
        gain: 0.38,
        delay: 0.035,
      },
    ],
  } satisfies SoundPreset,

  toggleOff: {
    layers: [
      {
        source: { type: "sine" as OscillatorType, frequency: 620 },
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 },
        gain: 0.42,
      },
      {
        source: { type: "sine" as OscillatorType, frequency: 410 },
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 },
        gain: 0.38,
        delay: 0.03,
      },
    ],
  } satisfies SoundPreset,

  // Search / retry — soft press: pink noise + two sines + low-pass
  pressSoft: {
    layers: [
      {
        source: { type: "noise" as const, color: "pink" as const },
        filter: { type: "lowpass" as BiquadFilterType, frequency: 1800, resonance: 0.7 },
        envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 },
        gain: 0.18,
      },
      {
        source: { type: "sine" as OscillatorType, frequency: { start: 220, end: 140 } },
        filter: { type: "lowpass" as BiquadFilterType, frequency: 1200 },
        envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.03 },
        gain: 0.32,
      },
      {
        source: { type: "sine" as OscillatorType, frequency: 480 },
        filter: { type: "lowpass" as BiquadFilterType, frequency: 2000 },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
        gain: 0.18,
        delay: 0.012,
      },
    ],
  } satisfies SoundPreset,
} as const;

export type SoundPresetName = keyof typeof SOUND_PRESETS;

export const UI_SOUND_VOLUME = 0.35;
