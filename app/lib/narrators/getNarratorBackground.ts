export function getNarratorBackground(
  narratorId: string
) {
  switch (narratorId) {
    case "victorian_detective":
      return {
        overlay:
          "bg-gradient-to-b from-amber-950/10 via-orange-900/5 to-black/10",

        glow:
          "bg-orange-400/10",
      };

    case "midnight_storyteller":
      return {
        overlay:
          "bg-gradient-to-b from-indigo-950/30 via-transparent to-black/30",

        glow:
          "bg-blue-500/10",
      };

    case "dark_narrator":
      return {
        overlay:
          "bg-gradient-to-b from-black/40 via-black/10 to-black/40",

        glow:
          "bg-red-950/20",
      };

    default:
      return {
        overlay:
          "bg-gradient-to-b from-amber-950/10 via-orange-900/5 to-black/10",

        glow:
          "bg-orange-400/10",
      };
  }
}