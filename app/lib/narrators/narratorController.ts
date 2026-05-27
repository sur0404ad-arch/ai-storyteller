export type Narrator = {
  id: string;
  name: string;
  title: string;
  mood: string;
  description: string;
  accentColor: string;
};

export const NARRATORS: Narrator[] = [
  {
    id: "victorian_detective",
    name: "Marcus",
    title: "Victorian Detective",
    mood: "Dark Investigation",
    description:
      "A deep cinematic storyteller with a mysterious Victorian atmosphere.",
    accentColor: "#c27b48",
  },

  {
    id: "midnight_storyteller",
    name: "Victoria",
    title: "Midnight Storyteller",
    mood: "Late Night Calm",
    description:
      "Soft emotional narration designed for immersive night listening.",
    accentColor: "#9d6df0",
  },

  {
    id: "dark_narrator",
    name: "Clyde",
    title: "Dark Narrator",
    mood: "Psychological Tension",
    description:
      "Intense cinematic narration for suspense and gothic storytelling.",
    accentColor: "#c94f4f",
  },
];