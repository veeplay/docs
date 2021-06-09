---
title: Frequently Asked Questions
description: Answers to all your Veeplay-related questions.
---

## Video API

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

## Video Player

### Playback doesn't work and I'm seeing an "Invalid License" error in the console.
To use the Veeplay video players within your mobile or web apps, you need to register them inside your [Veeplay account dashboard](https://panel.veeplay.com):
- for iOS, you'll need to specify your app's bundle identifier;
- for Android, you'll need to specify your app's package name;
- for web apps, you can use the player on `localhost` without registering an app - otherwise, you'll need to specify your app's domain name.

### Can I autoplay videos?
To improve user experience, browsers and OSs enforce strict policies regarding video autoplay. Generally, autoplay is only allowed without sound before the user interacts with your app/domain in a meaningful way.
- For **Chrome**, video is also allowed to autoplay with sound, depending on the users' Media Engagement Index(MEI). This is a measurement of previous user interaction with a specific domain, and is highest on sites where you regularly play media. See [your local MEI scores](chrome://media-engagement/) and read more about [Chrome autoplay policies](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes).
- For **Safari**, the user is in control over which sites are allowed to autoplay. By default, autoplay executes only if the video doesn’t contain an audio track, or if the video is muted. Read more about [Safari's autoplay policy](https://developer.apple.com/documentation/webkit/delivering_video_content_for_safari).
- For **Firefox**, all video with sound is prevented from autoplay by default. Read more about [Firefox's autoplay policy](https://support.mozilla.org/en-US/kb/block-autoplay).

To make sure your video will autoplay, set the player to mute after starting playback:

```js
// Instruct the player to start playback
player.playMediaUnits(units);
player.setMute();
```

### Can I customize the player controls UI?
Yes, UI customizations are supported. See a list of [controls customization options](/json-configuration/#root.properties.content.items.properties.controls) for JSON configuration. Similar properties are also natively available for each platform.

### Can I instantiate multiple players?
The Android & iOS players are singletons, so you can only have a single player instance at a time.
Multiple players are, however, supported with the JS SDK:

```html
<div id="player-one"></div>
<div id="player-two"></div>
<script src="https://cdn.veeplay.com/veeplay-web/latest/mp.bundle.js"></script>
<script>
const playerOne = new MediaPlayer('player-one');
const playerTwo = new MediaPlayer('player-two');
playerOne.playMediaUnits([ new MediaUnit(firstUrl) ]);
playerTwo.playMediaUnits([ new MediaUnit(secondUrl) ]);
</script>
```
