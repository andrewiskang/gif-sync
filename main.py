# steps to creating final product:
#  1. convert GIF and .mp3 into .mp4 file
#     DONE
#  2. loop GIF and .mp3 into .mp4 file
#     DONE
#  3. analyze .mp3 file (using bpm), return results
#  4. adjust speed of looping GIF based on .mp3 results
#  5. convert adjusted, looped GIF and .mp3 into .mp4 file

from __future__ import print_function
import ffmpeg
import os
import json

def convertToVideo(gifPath, mp3Path, outPath):
    mp3 = ffmpeg.input(mp3Path)
    gif = ffmpeg.input(gifPath, stream_loop=-1)
    a = mp3["a"]
    v = gif["v"]

    # duration capped at 5 minutes
    duration = min(float(ffmpeg.probe(mp3Path)["format"]["duration"]), 300)
    (
        ffmpeg
        .output(v, a, outPath, t=duration)
        .run(overwrite_output=True)
    )


gifPath = None
mp3Path = None

for file in os.listdir("in/"):
    if file.endswith(".gif"):
        gifPath = "in/" + file
        break
for file in os.listdir("in/"):
    if file.endswith(".mp3"):
        mp3Path = "in/" + file
        break

if gifPath and mp3Path:
    convertToVideo(gifPath, mp3Path, "out/out.mp4")
