export const BOOKS = [
  {
    id: 1,
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    cover: "/bg-main.png",
    sourceText: "/books/1661-0.txt",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",

    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "A Scandal in Bohemia",

        audioByVoice: {
          michael: "/sherlock-michael.mp3",
          james: "/sherlock-james.mp3",
          robert: "/sherlock-robert.mp3",
          emma: "/sherlock-emma.mp3",
          olivia: "/sherlock-olivia.mp3",
          sophia: "/sherlock-sophia.mp3",
        },

        duration: "0:12",

        preview:
          "To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name.",

        captions: [
          "To Sherlock Holmes she is always the woman.",
          "I have seldom heard him mention her",
          "under any other name.",
        ],
      },
    ],
  },

  {
    id: 2,
    title: "Dracula",
    author: "Bram Stoker",
    cover: "/bg-main.png",
    sourceText: "",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",

    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "Jonathan Harker's Journal",

        audioByVoice: {
          michael: "/dracula-michael.mp3",
          james: "/dracula-james.mp3",
          robert: "/dracula-robert.mp3",
          emma: "/dracula-emma.mp3",
          olivia: "/dracula-olivia.mp3",
          sophia: "/dracula-sophia.mp3",
        },

        duration: "0:12",

        preview:
          "Left Munich at 8:35 P.M. on 1st May. Arriving at Vienna early next morning.",

        captions: [
          "Left Munich at 8:35 P.M. on 1st May.",
          "Arriving at Vienna early next morning.",
          "Buda-Pesth seems a wonderful place.",
        ],
      },
    ],
  },

  {
    id: 3,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "/bg-main.png",
    sourceText: "",
    sourceName: "Project Gutenberg",
    sourceType: "public-domain",

    chapters: [
      {
        id: 1,
        title: "Chapter I",
        subtitle: "Netherfield Park",

        audioByVoice: {
          michael: "/pride-michael.mp3",
          james: "/pride-james.mp3",
          robert: "/pride-robert.mp3",
          emma: "/pride-emma.mp3",
          olivia: "/pride-olivia.mp3",
          sophia: "/pride-sophia.mp3",
        },

        duration: "0:12",

        preview:
          "It is a truth universally acknowledged, that a single man in possession of a good fortune.",

        captions: [
          "It is a truth universally acknowledged.",
          "That a single man in possession",
          "of a good fortune.",
        ],
      },
    ],
  },
];