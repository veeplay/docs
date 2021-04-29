---
description: A visual guide to how modern video streaming works.
image: /img/video-guides/how-video-streaming-works.gif
---

# How Video Streaming Works

Just upload the MP4 to S3 and we're done, right? We wish it was that easy.

## Progressive Download

The simplest way to achieve video playback over the web is to:

- Obtain or create a single render of the underlying media, usually in the form of a static, large `.mp4` file (`.webm` files are also popular);
- Store that file on a server, under a publicly accessible URL;
- Optionally, attach the source endpoint to a Content Delivery Network, that will cache the original file in multiple data centers around the world, allowing the viewer to retrieve his copy  faster, from a local server;
- Integrate a player component in your application.

When the player needs to start rendering a video, it will start downloading the file from the nearest CDN endpoint. As long as the network bandwidth is large enough to allow the player to download the file faster than it can play, playback will be smooth. However, a series of issues become evident:

- The **player UI** size is usually not fixed but responsive, and needs to be able to **vary with device types and screen sizes**. This makes choosing the right source file resolution problematic: since we’ll be handing responsiveness client-side, the source should ideally be able to accommodate the largest resolution we want to support.
- A high-quality source file is usually **very large in size**, and it will take long to download even under good network conditions.
- When users stop watching or skip portions of the clip, potentially large (and costly) amounts of downloaded data **go to waste**.

![Progressive video download over a good network](/img/video-guides/progressive-video-download-good-network.gif)
> Progressive download for static video files: bandwidth is potentially wasted.

Another issue with choosing the right quality vs size for progressive download videos becomes apparent when we consider streaming under constrained networks. A high quality, high size render will have trouble **buffering** to keep up with playback, resulting in a bad user experience:

![Progressive video download over a bad network](/img/video-guides/progressive-video-download-bad-network.gif)
> Progressive download over constrained networks results in bad user experience.

## Streaming

The first step to fixing the problems with progressive downloads described above is to generate **multiple renderings of the original media**, different in resolution and quality. This is a process generally called encoding. Depending on the selected codec and configuration, a source file can be converted to a series of individual outputs of different qualities and sizes.

Additionally, each rendering might be broken up into same-length pieces called **segments**. This will allow players to granularly buffer content relative to the current playhead, rather than downloading an entire file blob. An alternative to segments is using HTTP range requests or a similar mechanism, depending on player and server feature availability.

Video processing workflows can be implemented using many different products and solutions, but the easiest way to get started is to make use of a web service for video transcoding and management, like the [Veeplay Video API](https://veeplay.com/video-api-cloud/).

![Transcoding a video to multiple qualities](/img/video-guides/video-transcoding-multiple-quality.png)

The resulting rendering segments are then all uploaded to storage, cached on a CDN and made available to players. A playlist index file is also generated, connecting each individual segment to a specific playback time interval, and exposing metadata like information about bitrate and quality.

## HTTP Streaming Protocols

**HLS (HTTP Live Streaming)** and **DASH (Dynamic Adaptive Streaming over HTTP)** are the two main competing standards for implementing live streaming. [HLS](https://developer.apple.com/streaming/) was released by Apple in 2009 and is currently the market leader, while [DASH](https://dashif.org/) was published in 2012 and is promoted by the DASH Industry Forum (Microsoft, Netflix, Google, Ericsson, Samsung, Adobe, etc.)

A master HLS m3u8 playlist that references multiple renderings might look like the example below. Notice the links to other playlist files for each individual render, connected to a specific bandwidth requirement and other metadata like resolution. Four video renditions are referenced, with varying resolutions and bandwidths, encoded with H.264 (AVC). One audio track is also referenced, as audio and video tracks are generally separated as part of the transcoding process.

:::note
Multiple audio tracks can be included, as well as subtitle tracks and other metadata.
:::

    #EXTM3U
    #EXT-X-STREAM-INF:BANDWIDTH=150000,RESOLUTION=416x234,CODECS="avc1.42e00a,mp4a.40.2"
    https://example.com/low/index.m3u8
    #EXT-X-STREAM-INF:BANDWIDTH=240000,RESOLUTION=416x234,CODECS="avc1.42e00a,mp4a.40.2"
    https://example.com/lo_mid/index.m3u8
    #EXT-X-STREAM-INF:BANDWIDTH=440000,RESOLUTION=416x234,CODECS="avc1.42e00a,mp4a.40.2"
    https://example.com/hi_mid/index.m3u8
    #EXT-X-STREAM-INF:BANDWIDTH=640000,RESOLUTION=640x360,CODECS="avc1.42e00a,mp4a.40.2"
    https://example.com/high/index.m3u8
    #EXT-X-STREAM-INF:BANDWIDTH=64000,CODECS="mp4a.40.5"
    https://example.com/audio/index.m3u8

_Source: Apple’s HLS guide to [creating a master playlist](https://developer.apple.com/documentation/http_live_streaming/example_playlists_for_http_live_streaming/creating_a_master_playlist)._

A simple HLS m3u8 playlist for a single rendering might look like this - notice links to the actual video segments, ordered by time interval:

    #EXTM3U
    #EXT-X-VERSION:3
    #EXT-X-TARGETDURATION:8
    #EXT-X-MEDIA-SEQUENCE:2680
    
    #EXTINF:7.975,
    https://priv.example.com/fileSequence2680.ts
    #EXTINF:7.941,
    https://priv.example.com/fileSequence2681.ts
    #EXTINF:7.975,
    https://priv.example.com/fileSequence2682.ts

_Source: [the HLS RFC 8216 specs](https://tools.ietf.org/html/rfc8216)._

## Adaptive Bitrate Streaming

A context-aware player can now download the playlist file, evaluate a series of on-device factors, like UI size and available bandwidth, and make a series of smart, local decisions about which of the segments to download and play at a given time. The result is adaptive bitrate streaming, or ABR - a process that optimises both network costs and the end-user experience.

![How video streaming works](/img/video-guides/how-video-streaming-works.gif)
> Video streaming fixes the issues with progressive downloads

:::note
We've simplified things for this representation. In real-life, at least an audio track would also be included in the playlist, and downloaded separately. Subtitle tracks or alternate audio might also be included - the player could then allow the user to choose to change the audio to another language, or display any of the availablle subtitles.
:::

## Live Broadcast Streaming

In the case of live events, the streaming process looks very similar to what we described above, the difference being that encoding and segmenting goes on continuously, in real time:

![How live video streaming works](/img/video-guides/how-live-video-streaming-works.gif)
> Encoding, delivery and rendering are continuous for live streams.
