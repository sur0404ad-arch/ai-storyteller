from kokoro import KPipeline
import soundfile as sf

pipeline = KPipeline(lang_code="a")

TEXT = """
Welcome to AI Storyteller.
This is a real American AI narrator voice.
Today we are testing different voices for audiobook listening.
"""

VOICES = [
    ("am_adam", "voice-michael.mp3"),
    ("am_michael", "voice-james.mp3"),
    ("am_echo", "voice-robert.mp3"),
    ("af_bella", "voice-emma.mp3"),
    ("af_sarah", "voice-olivia.mp3"),
    ("af_nicole", "voice-sophia.mp3"),
]

for voice_id, file_name in VOICES:
    generator = pipeline(
        TEXT,
        voice=voice_id,
        speed=1,
    )

    for _, _, audio in generator:
        sf.write(f"public/{file_name}", audio, 24000)

    print(f"DONE: {file_name}")

print("ALL VOICES READY")