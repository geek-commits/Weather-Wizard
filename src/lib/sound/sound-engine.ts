import { SOUND_PRESETS, type SoundPresetName } from "./presets";
import type { SoundLayer } from "./types";

// Singleton AudioContext
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  const Ctx = w.AudioContext ?? w.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new Ctx({ latencyHint: "interactive" } as AudioContextOptions);
  }
  return audioCtx;
}

async function ensureAudioContext(): Promise<AudioContext | null> {
  const ctx = getAudioContext();
  if (!ctx) return null;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      // resume may fail without user gesture — swallow
    }
  }
  return ctx;
}

// Noise generation — white + pink (multi-state approx)
function createNoiseBuffer(ctx: AudioContext, color: "white" | "pink", duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(1, Math.floor(sampleRate * duration));
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  if (color === "white") {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
  // Pink noise — simple one-pole approximation with multiple states
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    data[i] = pink * 0.11;
  }
  return buffer;
}

function scheduleEnvelope(gain: GainNode, start: number, env: SoundLayer["envelope"], peak: number) {
  const floor = 0.0001;
  const p = Math.max(floor, peak);
  const sustain = Math.max(floor, peak * (env.sustain || floor));
  gain.gain.setValueAtTime(floor, start);
  gain.gain.exponentialRampToValueAtTime(p, start + env.attack);
  gain.gain.exponentialRampToValueAtTime(sustain, start + env.attack + env.decay);
  gain.gain.setValueAtTime(sustain, start + env.attack + env.decay);
  gain.gain.exponentialRampToValueAtTime(floor, start + env.attack + env.decay + Math.max(0.01, env.release));
}

function isNoiseSource(s: SoundLayer["source"]): s is { type: "noise"; color: "white" | "pink" } {
  return s.type === "noise";
}

export async function playSound(presetName: SoundPresetName = "select", masterVolume = 1): Promise<void> {
  const preset = SOUND_PRESETS[presetName];
  if (!preset) return;
  const ctx = await ensureAudioContext();
  if (!ctx) return;
  const layers: SoundLayer[] = "layers" in preset ? preset.layers : [preset as SoundLayer];
  const now = ctx.currentTime;

  for (const layer of layers) {
    const start = now + (layer.delay ?? 0);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.connect(ctx.destination);
    // Apply master volume as multiplier on gain node initial
    const layerGain = layer.gain * masterVolume;
    // Create filter if present
    let destination: AudioNode = gain;
    let filter: BiquadFilterNode | null = null;
    if (layer.filter) {
      filter = ctx.createBiquadFilter();
      filter.type = layer.filter.type;
      filter.frequency.setValueAtTime(layer.filter.frequency, start);
      if (layer.filter.resonance !== undefined) filter.Q.setValueAtTime(layer.filter.resonance, start);
      gain.connect(filter);
      filter.connect(ctx.destination);
      destination = filter;
      // Rewire: gain -> filter -> destination, so disconnect gain from destination and connect via filter
      gain.disconnect();
      gain.connect(filter);
    }

    scheduleEnvelope(gain, start, layer.envelope, layerGain);

    // Source creation
    const duration = layer.envelope.attack + layer.envelope.decay + layer.envelope.release + 0.05;
    const stopAt = start + duration;

    if (isNoiseSource(layer.source)) {
      const buffer = createNoiseBuffer(ctx, layer.source.color, duration + 0.02);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(gain);
      src.start(start);
      src.stop(stopAt);
    } else {
      const osc = ctx.createOscillator();
      osc.type = layer.source.type;
      const freq = layer.source.frequency;
      if (typeof freq === "number") {
        osc.frequency.setValueAtTime(freq, start);
      } else {
        osc.frequency.setValueAtTime(freq.start, start);
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, freq.end), start + layer.envelope.attack + layer.envelope.decay * 0.5);
      }
      // FM
      let fmOsc: OscillatorNode | null = null;
      let fmGain: GainNode | null = null;
      if (layer.source.fm) {
        fmOsc = ctx.createOscillator();
        fmOsc.type = "sine";
        fmOsc.frequency.setValueAtTime(osc.frequency.value * layer.source.fm.ratio, start);
        fmGain = ctx.createGain();
        fmGain.gain.setValueAtTime(layer.source.fm.depth, start);
        fmOsc.connect(fmGain);
        fmGain.connect(osc.frequency);
        fmOsc.start(start);
        fmOsc.stop(stopAt);
      }
      osc.connect(gain);
      osc.start(start);
      osc.stop(stopAt);
    }

    // Cleanup is automatic via stop; add safety to disconnect after stop
    // No React state needed
    // Ensure destination still connected
    void destination;
  }
}
