# Livestory

Tell a story and get a live feed of images.

## Setup

```
git clone https://github.com/zeke/livestory
cd livestory
script/bootstrap
```

## Usage

1. Run `npm start`
2. Start talking
3. output directory fills up with images

## What tools are used?

- WhisperCPP
- SDXL Turbo on Coreweave
- LCM (different versions) on Replicate

## Run on Windows + OpenVINO platform
* simple STT server which provides text stream transcribed by a local audio input(microphone) 
```
node sttstream_serv.js
```
* integrate `textstream_cli.py` into your SDXL-turbo jupyter notebook 

## Learnin's

- Whisper CPP is easy to get running locally, and it's pretty fast.
- Whisper CPP shell output is kinda hard to deal with. It retroactively autocorrects.
- LCM default styles are leaning towards NSFW
- Running models on a Coreweave instance is directly faster than Replicate (for now)
