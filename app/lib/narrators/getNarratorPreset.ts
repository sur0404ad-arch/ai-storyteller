import {
  NARRATOR_PRESETS,
  type NarratorPreset,
} from "./narratorPresets";

export function getNarratorPreset(
  narratorId: string
): NarratorPreset {
  return (
    NARRATOR_PRESETS.find(
      (preset) => preset.id === narratorId
    ) || NARRATOR_PRESETS[0]
  );
}