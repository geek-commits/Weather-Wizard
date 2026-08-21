export type FrequencyValue = number | { start: number; end: number };

export type NoiseSource = {
  type: "noise";
  color: "white" | "pink";
};

export type OscillatorSource = {
  type: OscillatorType;
  frequency: FrequencyValue;
  fm?: { ratio: number; depth: number };
};

export interface SoundLayer {
  source: NoiseSource | OscillatorSource;
  filter?: { type: BiquadFilterType; frequency: number; resonance?: number };
  envelope: { attack: number; decay: number; sustain: number; release: number };
  delay?: number;
  gain: number;
}

export type SoundPreset = SoundLayer | { layers: SoundLayer[] };
