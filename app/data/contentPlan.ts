export type ContentSource = {
  id: string;
  name: string;
  url: string;
  type: "public-domain" | "licensed" | "owned";
  status: "approved" | "research" | "blocked";
};

export const APPROVED_CONTENT_SOURCES: ContentSource[] = [
  {
    id: "project-gutenberg",
    name: "Project Gutenberg",
    url: "https://www.gutenberg.org",
    type: "public-domain",
    status: "approved",
  },
  {
    id: "standard-ebooks",
    name: "Standard Ebooks",
    url: "https://standardebooks.org",
    type: "public-domain",
    status: "approved",
  },
  {
    id: "open-library",
    name: "Open Library",
    url: "https://openlibrary.org",
    type: "public-domain",
    status: "research",
  },
];

export const CONTENT_RULES = [
  "Use English books first for the US market.",
  "Use only public domain, licensed, or owned content.",
  "Do not use copyrighted modern books without license.",
  "Start with classics that are already known to US readers.",
  "Every book must later have chapters, narrator voice, progress, and source metadata.",
];