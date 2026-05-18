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
  tags: string[];
  popularityRank: number;
  estimatedDuration: string;
  chapters: BookChapter[];
};

const GENERATED_AUDIO: Record<VoiceId, string> = {
  michael: "/generated/test-michael.mp3",
  james: "/generated/test-james.mp3",
  robert: "/generated/test-robert.mp3",
  emma: "/generated/test-emma.mp3",
  olivia: "/generated/test-olivia.mp3",
  sophia: "/generated/test-sophia.mp3",
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
    description: "A legendary detective collection built for cinematic listening.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 1661,
      textUrl: "https://www.gutenberg.org/files/1661/1661-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/1661",
    },
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
        audioByVoice: GENERATED_AUDIO,
      },
      {
        id: 2,
        title: "Chapter II",
        subtitle: "The Red-Headed League",
        duration: "0:12",
        preview: "I had called upon my friend Sherlock Holmes.",
        captions: ["I had called upon my friend Sherlock Holmes."],
        audioByVoice: GENERATED_AUDIO,
      },
      {
        id: 3,
        title: "Chapter III",
        subtitle: "A Case of Identity",
        duration: "0:12",
        preview: "My dear fellow, said Sherlock Holmes.",
        captions: ["My dear fellow, said Sherlock Holmes."],
        audioByVoice: GENERATED_AUDIO,
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
    description: "A gothic classic with dark atmosphere and dramatic narration.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 345,
      textUrl: "https://www.gutenberg.org/files/345/345-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/345",
    },
    tags: ["horror", "gothic", "vampire", "classic"],
    popularityRank: 2,
    estimatedDuration: "15h 20m",
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "Jonathan Harker's Journal",
        duration: "0:12",
        preview: "Left Munich at 8:35 P.M. on 1st May.",
        captions: ["Left Munich at 8:35 P.M. on 1st May."],
        audioByVoice: GENERATED_AUDIO,
      },
    ],
  },
  {
    id: 3,
    slug: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/bg-main.png",
    access: "free",
    isFeatured: false,
    category: "Romance",
    description: "A timeless romantic classic prepared for premium listening.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 1342,
      textUrl: "https://www.gutenberg.org/files/1342/1342-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/1342",
    },
    tags: ["romance", "classic", "jane austen", "society"],
    popularityRank: 3,
    estimatedDuration: "12h 10m",
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "Netherfield Park",
        duration: "0:12",
        preview: "It is a truth universally acknowledged.",
        captions: ["It is a truth universally acknowledged."],
        audioByVoice: GENERATED_AUDIO,
      },
    ],
  },
  {
    id: 4,
    slug: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    cover: "/bg-main.png",
    access: "free",
    isFeatured: false,
    category: "Horror",
    description: "A dark gothic story about creation, ambition, and consequence.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 84,
      textUrl: "https://www.gutenberg.org/files/84/84-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/84",
    },
    tags: ["horror", "gothic", "science fiction", "classic"],
    popularityRank: 4,
    estimatedDuration: "8h 40m",
    chapters: [
      {
        id: 1,
        title: "Letter I",
        subtitle: "To Mrs. Saville, England",
        duration: "0:12",
        preview: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise.",
        captions: ["You will rejoice to hear that no disaster has accompanied the commencement of an enterprise."],
        audioByVoice: GENERATED_AUDIO,
      },
    ],
  },
  {
    id: 5,
    slug: "alice-in-wonderland",
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    cover: "/bg-main.png",
    access: "free",
    isFeatured: false,
    category: "Fantasy",
    description: "A surreal fantasy classic with playful characters and dreamlike scenes.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 11,
      textUrl: "https://www.gutenberg.org/files/11/11-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/11",
    },
    tags: ["fantasy", "children", "classic", "adventure"],
    popularityRank: 5,
    estimatedDuration: "3h 10m",
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "Down the Rabbit-Hole",
        duration: "0:12",
        preview: "Alice was beginning to get very tired of sitting by her sister on the bank.",
        captions: ["Alice was beginning to get very tired of sitting by her sister on the bank."],
        audioByVoice: GENERATED_AUDIO,
      },
    ],
  },
  {
    id: 6,
    slug: "moby-dick",
    title: "Moby-Dick",
    author: "Herman Melville",
    cover: "/bg-main.png",
    access: "premium",
    isFeatured: false,
    category: "Adventure",
    description: "A monumental sea adventure about obsession, fate, and the white whale.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 2701,
      textUrl: "https://www.gutenberg.org/files/2701/2701-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/2701",
    },
    tags: ["adventure", "classic", "sea", "american"],
    popularityRank: 6,
    estimatedDuration: "21h 00m",
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "Loomings",
        duration: "0:12",
        preview: "Call me Ishmael.",
        captions: ["Call me Ishmael."],
        audioByVoice: GENERATED_AUDIO,
      },
    ],
  },
  {
    id: 7,
    slug: "the-picture-of-dorian-gray",
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    cover: "/bg-main.png",
    access: "premium",
    isFeatured: false,
    category: "Classic",
    description: "A stylish gothic classic about beauty, corruption, and hidden decay.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 174,
      textUrl: "https://www.gutenberg.org/files/174/174-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/174",
    },
    tags: ["classic", "gothic", "philosophy", "beauty"],
    popularityRank: 7,
    estimatedDuration: "8h 00m",
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "The Studio",
        duration: "0:12",
        preview: "The studio was filled with the rich odor of roses.",
        captions: ["The studio was filled with the rich odor of roses."],
        audioByVoice: GENERATED_AUDIO,
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