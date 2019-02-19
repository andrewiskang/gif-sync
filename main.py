# steps to creating final product:
#  1. convert GIF and .mp3 into .mp4 file
#     DONE
#  2. loop GIF and .mp3 into .mp4 file
#     IN PROGRESS
#  3. analyze .mp3 file (using bpm), return results
#  4. adjust speed of looping GIF based on .mp3 results
#  5. convert adjusted, looped GIF and .mp3 into .mp4 file

from __future__ import print_function
import ffmpeg
import os

def convertToVideo(gifPath, mp3Path, outPath):
    mp3 = ffmpeg.input(mp3Path)
    gif = ffmpeg.input(gifPath, stream_loop=-1)
    a1 = mp3["a"]
    v1 = mp3["v"]
    (
        ffmpeg
        .output(mp3, gif, outPath, shortest=outPath)
        .run() #overwrite_output=True
    )


gifPaths = []
mp3Paths = []

for file in os.listdir("in/"):
    if file.endswith(".gif"):
        gifPaths.append("in/" + file)
    elif file.endswith(".mp3"):
        mp3Paths.append("in/" + file)

counter = 0
for gifPath in gifPaths:
    for mp3Path in mp3Paths:
        convertToVideo(gifPath, mp3Path, "out/out"+str(counter)+".mp4")
        counter += 1