# HLS .m3u8 Manifests

Veeplay supports `.m3u8` HLS manifests with an `EXT-X-VERSION` of `3` or higher for live streaming and video on demand (VOD). When Veeplay encounters an ad avail, it attempts ad insertion or replacement, based on the type of content. If there aren't enough ads to fill the duration, for the remainder of the ad avail, Veeplay displays the underlying content stream or the configured slate.

HLS manifests must satisfy the following requirements:
+ Manifests must be accessible on the public internet.
+ Manifests must be live or video-on-demand (VOD).
+ Manifests must have an `EXT-X-VERSION` of `3` or higher.
+ For live content, manifests must contain markers to delineate ad avails. This is optional for VOD content, which can use VMAP timeoffsets instead. 

  The manifest file must have ad slots marked with one of the following:
  + **#EXT-X-CUE-OUT / #EXT-X-CUE-IN** (more common) with durations as shown in the following example.

    ```
    #EXT-X-CUE-OUT:60.00
    #EXT-X-CUE-IN
    ```
  + **#EXT-X-DATERANGE** (less common) with durations as shown in the following example.

    ```
    #EXT-X-DATERANGE:ID="",START-DATE="",DURATION=30.000,SCTE35-OUT=0xF
    #EXT-X-DATERANGE:ID="",START-DATE="",DURATION=30.000,SCTE35-OUT=0xF
    ```

    All fields shown for `#EXT-X-DATERANGE` are required.

+ HLS master manifests must follow the HLS specification documented at [HTTP Live Streaming: Master Playlist Tags](https://tools.ietf.org/html/draft-pantos-http-live-streaming-21#section-4.3.4). In particular, `#EXT-X-STREAM-INF` must include the fields `RESOLUTION`, `BANDWIDTH`, and `CODEC`.

## HLS Manifest Tag Handling

### EXT-X-CUE Tags

Veeplay replaces `EXT-X-CUE-OUT`, `EXT-X-CUE-OUT-CONT`, and `EXT-X-CUE-IN` tags in the input manifest with `EXT-X-DISCONTINUITY` tags in the output manifest. The `DISCONTINUITY` tags mark the following boundaries:
+ Where the main content transitions to an ad
+ Where one ad transitions to another ad
+ Where an ad transitions back to the main content

### EXT-X-DATERANGE Tags

Veeplay passes through `EXT-X-DATERANGE` tags from the input manifest to the output manifest. Veeplay also inserts `EXT-X-DISCONTINUITY` tags that correspond to the `DATERANGE` tags. The `DISCONTINUITY` tags mark the following boundaries:
+ Where the main content transitions to an ad
+ Where one ad transitions to another ad
+ Where an ad transitions back to the main content

### EXT-X-KEY Tags

Veeplay passes through `EXT-X-KEY` tags from the input manifest. These tags indicate that the main content is encrypted. Since ads aren't encrypted, Veeplay inserts `EXT-X-KEY:METHOD=NONE` at the start of an ad avail. When playback returns to the main content, Veplay re-enables encryption by inserting the `EXT-X-KEY` tag with the `METHOD` value defined as the encryption type.

### Unrecognized Tags

Veeplay passes through all unknown and custom tags from the input manifest to the output manifest.

## HLS Supported Ad Markers

Veeplay identifies ad avail boundaries in an HLS manifest ad markers in the input manifest.

### EXT-X-CUE-OUT and EXT-X-CUE-IN

This type of ad marker is the most common. The following examples show options for these cue markers.

```
#EXT-X-CUE-OUT:DURATION=120
...
#EXT-X-CUE-IN
```

```
#EXT-X-CUE-OUT:30.000 
...
#EXT-X-CUE-IN
```

```
#EXT-X-CUE-OUT
...
#EXT-X-CUE-IN
```

### EXT-X-DATERANGE

With `EXT-X-DATERANGE` ad marker tags, you use `SCTE35-OUT` attributes to specify the timing of the ad avail. 

**Note**  
Veeplay ignores any `START-DATE` attributes that are provided for `EXT-X-DATERANGE` ad markers. 

You can specify the ad avail in one of the following ways:
+ `EXT-X-DATERANGE` tag with `SCTE35-OUT` and `DURATION` specifications. 

  Example

  ```
  #EXT-X-DATERANGE:ID="splice-6FFFFFF0",START-DATE="2019-01T00:15:00Z\",DURATION=60.000,SCTE35-OUT=0xF
  ```
+ Paired `EXT-X-DATERANGE` tags, the first with a `SCTE35-OUT` specification and the second with a `SCTE35-IN` specification. 

  Example

  ```
  #EXT-X-DATERANGE:ID="splice-6FFFFFF0",START-DATE="2019-01T00:15:00Z\",SCTE35-OUT=0xF
  ...
  #EXT-X-DATERANGE:ID="splice-6FFFFFF0",START-DATE="2019-01T00:15:00Z\",SCTE35-IN=0xF
  ```
+ A combination of the prior options. You specify an `EXT-X-DATERANGE` tag with `SCTE35-OUT` and `DURATION` specifications followed by an `EXT-X-DATERANGE` tag with a `SCTE35-IN` specification. In this case, Veeplay uses the earliest cue-in setting from the two specifications.

  Example

  ```
  #EXT-X-DATERANGE:ID="splice-6FFFFFF0",START-DATE="2019-01T00:15:00Z\",DURATION=60.000,SCTE35-OUT=0xF
  ...
  #EXT-X-DATERANGE:ID="splice-6FFFFFF0",START-DATE="2019-01T00:15:00Z\",SCTE35-IN=0xF
  ```

### EXT-X-SPLICEPOINT-SCTE35

You append the `EXT-X-SPLICEPOINT-SCTE35` ad marker tag with a SCTE-35 payload in base64-encoded binary. The decoded binary must provide a SCTE-35 `splice_info_section` containing the cue-out marker `0x34`, for provider placement opportunity start, and the cue-in marker `0x35`, for provider placement opportunity end. 

The following example shows the splice point specification with base64-encoded binary payloads that specify the cue-out and cue-in markers. 

```
#EXT-X-SPLICEPOINT-SCTE35:/DA9AAAAAAAAAP/wBQb+uYbZqwAnAiVDVUVJAAAKqX//AAEjW4AMEU1EU05CMDAxMTMyMjE5M19ONAAAmXz5JA==
...
#EXT-X-SPLICEPOINT-SCTE35:/DA4AAAAAAAAAP/wBQb+tTeaawAiAiBDVUVJAAAKqH+/DBFNRFNOQjAwMTEzMjIxOTJfTjUAAIiGK1s=
```
