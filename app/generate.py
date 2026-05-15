from kokoro import KPipeline
import soundfile as sf

pipeline = KPipeline(lang_code="a")

BOOKS = [
    {
        "id": "sherlock",
        "text": """
        To Sherlock Holmes she is always the woman.
        I have seldom heard him mention her under any other name.
        """,
    },

    {
        "id": "dracula",
        "text": """
        Left Munich at 8:35 P.M. on 1st May.
        Arriving at Vienna early next morning.
        """,
    },

    {
        "id": "pride",
        "text": """
        It is a truth universally acknowledged,
        that a single man in possession of a good fortune,
        must be in want of a wife.
        """,
    },
]

VOICES = [
    ("michael", "am_adam"),
    ("james", "am_michael"),
    ("robert", "am_echo"),
    ("emma", "af_bella"),
    ("olivia", "af_sarah"),
    ("sophia", "af_nicole"),
]

for book in BOOKS:
    for voice_name, voice_id in VOICES:

        generator = pipeline(
            book["text"],
            voice=voice_id,
            speed=1,
        )

        file_name = f'{book["id"]}-{voice_name}.mp3'

        for _, _, audio in generator:
            sf.write(
                f'public/{file_name}',
                audio,
                24000
            )

        print(f'DONE: {file_name}')

print("ALL AUDIO READY")