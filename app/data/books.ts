export type VoiceId =
  | "michael"
  | "james"
  | "robert"
  | "emma"
  | "olivia"
  | "sophia";

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
  sourceName: "Project Gutenberg";
  sourceType: "public-domain";
  source: BookSource;
  chapters: BookChapter[];
};

const SHERLOCK_AUDIO: Record<VoiceId, string> = {
  michael: "/sherlock-michael.mp3",
  james: "/sherlock-james.mp3",
  robert: "/sherlock-robert.mp3",
  emma: "/sherlock-emma.mp3",
  olivia: "/sherlock-olivia.mp3",
  sophia: "/sherlock-sophia.mp3",
};

const DRACULA_AUDIO: Record<VoiceId, string> = {
  michael: "/dracula-michael.mp3",
  james: "/dracula-james.mp3",
  robert: "/dracula-robert.mp3",
  emma: "/dracula-emma.mp3",
  olivia: "/dracula-olivia.mp3",
  sophia: "/dracula-sophia.mp3",
};

const PRIDE_AUDIO: Record<VoiceId, string> = {
  michael: "/pride-michael.mp3",
  james: "/pride-james.mp3",
  robert: "/pride-robert.mp3",
  emma: "/pride-emma.mp3",
  olivia: "/pride-olivia.mp3",
  sophia: "/pride-sophia.mp3",
};

export const BOOKS: Book[] = [
  {
    id: 1,
    slug: "sherlock-holmes",
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    cover: "/bg-main.png",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 1661,
      textUrl: "https://www.gutenberg.org/files/1661/1661-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/1661",
    },
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "A Scandal in Bohemia",
        duration: "0:12",
        preview: "To Sherlock Holmes she is always the woman.",
        captions: [
          "To Sherlock Holmes she is always the woman.",
          "I have seldom heard him mention her.",
          "Under any other name.",
        ],
        audioByVoice: SHERLOCK_AUDIO,
      },
      {
        id: 2,
        title: "Chapter II",
        subtitle: "The Red-Headed League",
        duration: "0:12",
        preview: "I had called upon my friend Sherlock Holmes.",
        captions: [
          "I had called upon my friend Sherlock Holmes.",
          "Upon the second morning after Christmas.",
        ],
        audioByVoice: SHERLOCK_AUDIO,
      },
      {
        id: 3,
        title: "Chapter III",
        subtitle: "A Case of Identity",
        duration: "0:12",
        preview: "My dear fellow, said Sherlock Holmes.",
        captions: [
          "My dear fellow.",
          "Said Sherlock Holmes.",
          "As we sat on either side of the fire.",
        ],
        audioByVoice: SHERLOCK_AUDIO,
      },
    ],
  },
  {
    id: 2,
    slug: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    cover: "/bg-main.png",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 345,
      textUrl: "https://www.gutenberg.org/files/345/345-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/345",
    },
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "Jonathan Harker's Journal",
        duration: "0:12",
        preview: "Left Munich at 8:35 P.M. on 1st May.",
        captions: [
          "Left Munich at 8:35 P.M. on 1st May.",
          "Arriving at Vienna early next morning.",
          "Buda-Pesth seems a wonderful place.",
        ],
        audioByVoice: DRACULA_AUDIO,
      },
    ],
  },
  {
    id: 3,
    slug: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/bg-main.png",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",
    source: {
      name: "Project Gutenberg",
      type: "public-domain",
      gutenbergId: 1342,
      textUrl: "https://www.gutenberg.org/files/1342/1342-0.txt",
      catalogUrl: "https://www.gutenberg.org/ebooks/1342",
    },
    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "Netherfield Park",
        duration: "0:12",
        preview: "It is a truth universally acknowledged.",
        captions: [
          "It is a truth universally acknowledged.",
          "That a single man in possession.",
          "Of a good fortune.",
        ],
        audioByVoice: PRIDE_AUDIO,
      },
    ],
  },
];