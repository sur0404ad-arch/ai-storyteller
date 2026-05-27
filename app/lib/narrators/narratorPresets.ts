export type NarratorPreset = {
  id: string;
  name: string;

  playbackRate: number;

  ambienceVolume: number;

  pauseMultiplier: number;

  eq: "warm" | "dark" | "bright";
};

export const NARRATOR_PRESETS: NarratorPreset[] = [
  {
    id: "victorian_detective",

    name: "Victorian Detective",

    playbackRate: 0.95,

    ambienceVolume: 0.45,

    pauseMultiplier: 1.15,

    eq: "dark",
  },

  {
    id: "midnight_storyteller",

    name: "Midnight Storyteller",

    playbackRate: 0.88,

    ambienceVolume: 0.6,

    pauseMultiplier: 1.35,

    eq: "warm",
  },

  {
    id: "dark_narrator",

    name: "Dark Narrator",

    playbackRate: 1,

    ambienceVolume: 0.35,

    pauseMultiplier: 0.95,

    eq: "dark",
  },
];