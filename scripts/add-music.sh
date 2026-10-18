#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: scripts/add-music.sh <music-file> [id ...]"
  exit 1
fi

music="$1"
shift
in_dir="exports/videos"
out_dir="$in_dir/with-music"
mkdir -p "$out_dir"

if [ $# -gt 0 ]; then
  videos=()
  for id in "$@"; do videos+=("$in_dir/$id.mp4"); done
else
  shopt -s nullglob
  videos=("$in_dir"/*.mp4)
fi

if [ ${#videos[@]} -eq 0 ]; then
  echo "no videos in $in_dir"
  exit 1
fi

for video in "${videos[@]}"; do
  name="$(basename "$video")"
  length="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video")"
  fade_start="$(awk -v total="$length" 'BEGIN { printf "%.3f", (total > 1 ? total - 1 : 0) }')"
  ffmpeg -y -loglevel error -i "$video" -i "$music" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k \
    -af "afade=t=in:st=0:d=0.5,afade=t=out:st=$fade_start:d=1" \
    -t "$length" -movflags +faststart "$out_dir/$name"
  echo "saved $out_dir/$name"
done
