import { useCallback } from "react";
import { playSound } from "../lib/sound/sound-engine";
import type { SoundPresetName } from "../lib/sound/presets";
import { UI_SOUND_VOLUME } from "../lib/sound/presets";

export function useSound(preset: SoundPresetName = "select", enabled = true, volume: number = UI_SOUND_VOLUME): () => void {
  return useCallback(() => {
    if (!enabled) return;
    void playSound(preset, volume);
  }, [preset, enabled, volume]);
}
