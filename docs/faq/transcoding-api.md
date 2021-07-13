---
title: Video Transcoding API FAQ
description: Quick answers to all Veeplay Transcoding API related questions.
---

### How do I embed a transcoded video?
When a video is done transcoding, you'll see the `output` property appear in the [list asset](/video-api/#operation/listAssets) endpoint response, containing URLs for every asset created. You'll generally want to use [ABR streaming](/docs/video-guides/how-video-streaming-works), so note the HLS URL as HLS has the widest device compatibility:

```json
{
    "asset_id": "b29dc241-6812-4283-9c28-6d50ee31b945",
    ...
    "output": {
        "hls": "https://streaming.veeplay.com/demo/v.m3u8", // Note this URL
        "dash": "https://streaming.veeplay.com/demo/v.mpd",
        "mp4_low": "https://streaming.veeplay.com/demo/low.mp4",
        "mp4_medium": "https://streaming.veeplay.com/demo/medium.mp4",
        "mp4_high": "https://streaming.veeplay.com/demo/high.mp4"
    }
}
```

Then, use the Veeplay video player to render the video:

```html
<div id="player"></div>
<script src="https://cdn.veeplay.com/veeplay-web/latest/mp.bundle.js"></script>
<script>
const player = new MediaPlayer('player');
player.playMediaUnits([ new MediaUnit(hlsUrl) ]);
</script>
```

### Can I upload a source video file directly to the API?
Direct upload is a feature we're currently developing, and will be available soon. Meanwhile, you'll need to provide a publicly accessible URL for the source media file. If you have the file in your local filesystem, a simple way to get a temporary URL is to use `ngrok` to create a local fileserver - see [ngrok's docs](https://ngrok.com/docs#http-file-urls) on how to achieve this.

### Does the source file still need to be available after ingestion?
No. After the Veeplay API processes the source file, you can safely make it private or remove it from your storage.

### Does Veeplay keep a copy of the source file after ingestion?
No. After the Veeplay API processes the source file, it is removed from our systems permanently.

### What container formats and codecs are accepted for the source file?
See the [supported inputs](/video-api/#section/Supported-Inputs) section of the API docs for a list of accepted formats.

### What resolutions and bitrates will the transcoded output media have?
When generating multiple renditions to support Adaptive Bitrate streaming with HLS and DASH, Veeplay doesn't use a static bitrate ladder - instead, we use machine learning to infer the optimal ladder for conversion per-title, based on properties of each individual video. This results in an optimal selection of renditions being generated, that maximize the perceived video quality while minimizing bandwidth requirements.

### Do I get notified when a video is done processing?
You can setup a webhook URL to receive notifications on every media asset status update during the ingestion workflow. Read more about [setting up webhooks](/video-api/#section/Webhooks) in the API documentation.

### Can I crop my source file to specific start and end points?
Yes, cropping is supported. See the `clip` parameter of the [create asset](/video-api/#operation/createAsset) endpoint. Here's an example input that crops a 40s clip starting at 10 seconds:

```json
{
  "input_url": "https://video.com/source.mp4",
  "clip": {
    "start": "00:00:10:00",
    "end": "00:00:50:00"
  }
}
```

### Can I burn an image overlay or a watermark over the transcoded video?
Yes, overlays are supported. See the `overlays` parameter of the [create asset](/video-api/#operation/createAsset) endpoint. Here's an example that adds a logo to the bottom left area of the video, with the width equal to 20% of the full video width:

```json
{
  "input_url": "https://video.com/source.mp4",
  "overlays": [{
      "url": "https://example.com/logo.png",
      "width": "20%",
      "horizontal_margin": 20,
      "horizontal_align": "left"
  }]
}
```

### Can I normalize audio levels in my source video?
Yes, audio normalization is supported. This will bring audio loudness levels of your input to a standard target level during encoding. The algorithm used for audio normalization is [ITU-R BS.1770-1](https://www.itu.int/rec/R-REC-BS.1770), and the target loudness value is -24 LKFS.

See the `audio_normalization` parameter of the [create asset](/video-api/#operation/createAsset) endpoint. Here's an example of applying audio normalization:

```json
{
  "input_url": "https://video.com/source.mp4",
  "normalize_audio": true
}
```
