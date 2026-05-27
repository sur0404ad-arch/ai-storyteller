export type VoiceId =
  | "michael"
  | "james"
  | "robert"
  | "emma"
  | "olivia"
  | "sophia";

export type BookAccess = "free" | "premium";

export type BookCategory =
  | "Detective"
  | "Horror"
  | "Romance"
  | "Classic"
  | "Adventure"
  | "Fantasy"
  | "Children"
  | "Philosophy";

export type BookSource = {
  name: "Project Gutenberg";
  type: "public-domain";
  gutenbergId: number;
  textUrl: string;
  catalogUrl: string;
};

export type BookChapter = {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  preview: string;
  captions: string[];
  audioByVoice: Record<VoiceId, string>;
};

export type Book = {
  id: number;
  slug: string;
  title: string;
  author: string;
  cover: string;
  access: BookAccess;
  isFeatured: boolean;
  category: BookCategory;
  description: string;
  sourceName: "Project Gutenberg";
  sourceType: "public-domain";
  source: BookSource;
  sourceText?: string;
  tags: string[];
  popularityRank: number;
  estimatedDuration: string;
  chapters: BookChapter[];
};

const SHERLOCK_CHAPTER_1_AUDIO: Record<VoiceId, string> = {
  michael: "/generated/sherlock-holmes/michael/chapter-1.mp3",
  james: "/generated/sherlock-holmes/james/chapter-1.mp3",
  robert: "/generated/sherlock-holmes/robert/chapter-1.mp3",
  emma: "/generated/sherlock-holmes/emma/chapter-1.mp3",
  olivia: "/generated/sherlock-holmes/olivia/chapter-1.mp3",
  sophia: "/generated/sherlock-holmes/sophia/chapter-1.mp3",
};

const DRACULA_PREVIEW_AUDIO: Record<VoiceId, string> = {
  michael: "/audio/dracula/chapter-1.mp3",
  james: "/audio/dracula/chapter-1.mp3",
  robert: "/audio/dracula/chapter-1.mp3",
  emma: "/audio/dracula/chapter-1.mp3",
  olivia: "/audio/dracula/chapter-1.mp3",
  sophia: "/audio/dracula/chapter-1.mp3",
};

export const BOOKS: Book[] = [
  {
    id: 1,
    slug: "sherlock-holmes",
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    cover: "/bg-main.png",
    access: "free",
    isFeatured: true,
    category: "Detective",
    description:
      "A legendary detective collection built for cinematic listening.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 1661,
      textUrl: "https://www.gutenberg.org/files/1661/1661-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/1661",
    },
    sourceText: "/books/classics/1661-0.txt",
    tags: ["detective", "mystery", "classic", "british"],
    popularityRank: 1,
    estimatedDuration: "10h 30m",
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "A Scandal in Bohemia",
        duration: "0:12",
        preview: "To Sherlock Holmes she is always the woman.",
        captions: ["To Sherlock Holmes she is always the woman."],
        audioByVoice: { ...SHERLOCK_CHAPTER_1_AUDIO },
      },
    ],
  },
  {
    id: 2,
    slug: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    cover: "/bg-main.png",
    access: "free",
    isFeatured: true,
    category: "Horror",
    description:
      "A gothic classic with dark atmosphere and dramatic narration.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 345,
      textUrl: "https://www.gutenberg.org/files/345/345-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/345",
    },
    sourceText: "/books/classics/dracula.txt",
    tags: ["horror", "gothic", "vampire", "classic"],
    popularityRank: 2,
    estimatedDuration: "15h 20m",
    chapters: [
      {
        id: 1,
        title: "Preview",
        subtitle: "Free cinematic sample",
        duration: "160:23",
        preview: "Jonathan Harker begins his journey toward Castle Dracula.",
        captions: ["Jonathan Harker begins his journey toward Castle Dracula."],
        audioByVoice: { ...DRACULA_PREVIEW_AUDIO },
      },
    ],
  },
];

export const FREE_BOOKS = BOOKS.filter((book) => book.access === "free");
export const PREMIUM_BOOKS = BOOKS.filter((book) => book.access === "premium");
export const FEATURED_BOOKS = BOOKS.filter((book) => book.isFeatured);

export function getBookBySlug(slug: string) {
  return BOOKS.find((book) => book.slug === slug);
}

export function getBookById(id: number) {
  return BOOKS.find((book) => book.id === id);
}