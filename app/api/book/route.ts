import { NextResponse } from "next/server";

type Chapter = {
  title: string;
  text: string;
};

function cleanText(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/\*\*\* START OF[\s\S]*?\*\*\*/i, "")
    .replace(/\*\*\* END OF[\s\S]*$/i, "")
    .replace(/\[Illustration[^\]]*\]/gi, "")
    .replace(/\[[^\]]{1,80}\]/g, "")
    .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function extractChapters(text: string): Chapter[] {
  const cleanedText = cleanText(text);

  const chapterRegex =
    /(^|\n)(CHAPTER\s+[IVXLCDM\d]+|Chapter\s+[IVXLCDM\d]+|LETTER\s+\d+|Letter\s+\d+|BOOK\s+[IVXLCDM\d]+|Book\s+[IVXLCDM\d]+|VOLUME\s+[IVXLCDM\d]+|Volume\s+[IVXLCDM\d]+|Jonathan Harker's Journal|MINA MURRAY'S JOURNAL|Dr\. Seward's Diary|Lucy Westenra's Diary)/g;

  const matches = [...cleanedText.matchAll(chapterRegex)];

  if (matches.length < 2) {
    return [
      {
        title: "Original Text",
        text: cleanedText.slice(0, 12000),
      },
    ];
  }

  return matches.slice(0, 30).map((match, index) => {
    const start = match.index || 0;
    const end = matches[index + 1]?.index || cleanedText.length;

    return {
      title: match[2],
      text: cleanedText.slice(start, end).trim().slice(0, 12000),
    };
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ chapters: [] });
    }

    const response = await fetch(
      `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json({ chapters: [] });
    }

    const text = await response.text();

    return NextResponse.json({
      chapters: extractChapters(text),
    });
  } catch {
    return NextResponse.json({ chapters: [] });
  }
}