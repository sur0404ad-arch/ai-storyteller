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
  | "Classic";

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
    description:
      "A legendary detective collection built for cinematic listening.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 1661,
      textUrl:
        "https://www.gutenberg.org/files/1661/1661-0.txt",
      catalogUrl:
        "https://www.gutenberg.org/ebooks/1661",
    },
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "A Scandal in Bohemia",
        duration: "0:12",
        preview:
          "To Sherlock Holmes she is always the woman.",
        captions: [
          "To Sherlock Holmes she is always the woman.",
        ],
        audioByVoice: GENERATED_AUDIO,
      },
      {
        id: 2,
        title: "Chapter II",
        subtitle: "The Red-Headed League",
        duration: "0:12",
        preview:
          "I had called upon my friend Sherlock Holmes.",
        captions: [
          "I had called upon my friend Sherlock Holmes.",
        ],
        audioByVoice: GENERATED_AUDIO,
      },
      {
        id: 3,
        title: "Chapter III",
        subtitle: "A Case of Identity",
        duration: "0:12",
        preview:
          "My dear fellow, said Sherlock Holmes.",
        captions: [
          "My dear fellow, said Sherlock Holmes.",
        ],
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
    description:
      "A gothic classic with dark atmosphere and dramatic narration.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 345,
      textUrl:
        "https://www.gutenberg.org/files/345/345-0.txt",
      catalogUrl:
        "https://www.gutenberg.org/ebooks/345",
    },
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "Jonathan Harker's Journal",
        duration: "0:12",
        preview:
          "Left Munich at 8:35 P.M. on 1st May.",
        captions: [
          "Left Munich at 8:35 P.M. on 1st May.",
        ],
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
    description:
      "A timeless romantic classic prepared for premium listening.",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 1342,
      textUrl:
        "https://www.gutenberg.org/files/1342/1342-0.txt",
      catalogUrl:
        "https://www.gutenberg.org/ebooks/1342",
    },
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "Netherfield Park",
        duration: "0:12",
        preview:
          "It is a truth universally acknowledged.",
        captions: [
          "It is a truth universally acknowledged.",
        ],
        audioByVoice: GENERATED_AUDIO,
      },
    ],
  },
];