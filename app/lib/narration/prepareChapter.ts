export async function prepareChapter(
  paragraphs: string[],
  voices: string[]
) {
  try {
    const safeParagraphs = paragraphs
      .map((paragraph) => String(paragraph || "").trim())
      .filter((paragraph) => paragraph.length > 120)
      .slice(0, 6);

    if (safeParagraphs.length === 0) {
      return;
    }

    await fetch("/api/prepare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chunks: safeParagraphs,
        voices,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}