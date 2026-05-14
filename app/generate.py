from kokoro import KPipeline
import soundfile as sf

pipeline = KPipeline(lang_code="a")

BOOKS = [
    {
        "file": "sherlock.mp3",
        "voice": "am_adam",
        "text": """
        To Sherlock Holmes she is always the woman.
        I have seldom heard him mention her under any other name.
        In his eyes she eclipses and predominates the whole of her sex.
        """,
    },

    {
        "file": "dracula.mp3",
        "voice": "am_michael",
        "text": """
        Left Munich at 8:35 P.M. on 1st May.
        Arriving at Vienna early next morning.
        Buda-Pesth seems a wonderful place.
        """,
    },

    {
        "file": "pride.mp3",
        "voice": "af_bella",
        "text": """
        It is a truth universally acknowledged,
        that a single man in possession of a good fortune,
        must be in want of a wife.
        """,
    },
]

for book in BOOKS:
    generator = pipeline(
        book["text"],
        voice=book["voice"],
        speed=1,
    )

    for _, _, audio in generator:
        sf.write(
            f'public/{book["file"]}',
            audio,
            24000
        )

    print(f'DONE: {book["file"]}')

print("ALL BOOKS READY")