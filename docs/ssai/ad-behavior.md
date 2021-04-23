# Ad Behavior

Veeplay replaces or inserts ads into your manifests, depending on how the origin server configures the ad avails and on whether the content is VOD or live: 
+ With ad replacement, Veeplay replaces content segments with ads.
+ With ad insertion, Veeplay inserts ad content where segments don’t exist.

## Live Content Ad Behavior 

Veeplay is able to perform ad replacement for HLS and DASH live content using ad marker information.

When ad markers include the `DURATION` attribute, Veeplay uses the value to determine the duration of the ad avail, and then includes a set of ads that fit into the duration. If no duration is specified, Veeplay plays as many ads as it can until it encounters an ad marker that indicates a return to the main content. This may mean shortening an ad that is currently playing.

> Every `CUE-OUT` indicator must have a matching `CUE-IN` indicator in live workflows.

If Veeplay runs out of ads to play for the duration indicated, it plays the slate, if one is configured, or it returns to the underlying content. This can happen:
- when the ads that are available don't completely fill up the duration;
- when the ADS response doesn't provide enough ads to fill the ad avail;
- when ad duration is greater than avail duration.

> Veeplay also supports inserting pre-roll ads into a live stream. Contact your account representative to enable this functionality.

## VOD Content Ad Behavior

Veeplay makes a single call to the Ad Server configured, and creates ad avails based on the response:
+ Use VAST to inserts all ads from the response in an ad avail at the start of the manifest. This is a pre-roll.
+ Use VMAP to insert pre-roll, mid-roll, or post-roll ads to the stream. Veeplay uses all ads from each ad avail in the VMAP response for each ad avail in the manifest. 

> If your ad server does not support VMAP, Veeplay also supports custom VAST handling for mid-roll or post-roll support. Contact your account rep to enable this.

> When a segment overlaps an insertion point with VMAP for VOD content, Veeplay rounds down to the nearest insertion point. 


### HLS Post-Rolls With Ad Markers

For HLS post-rolls, `CUE-OUT/IN` markers must precede the last content segment. This is because the HLS spec requires tag decorators to be explicitly declared before a segment. 

For example, consider the following declaration. 

```
#EXT-X-CUE-OUT: 0
#EXT-X-CUE-IN
#EXTINF:4.000,
Videocontent.ts
#EXT-X-ENDLIST
```

Veeplay inserts a post-roll like the following.

```
#EXTINF:4.000,
Videocontent.ts
#EXT-X-DISCONTINUITY
#EXTINF:3.0,
Adsegment1.ts
#EXTINF:3.0,
Adsegment2.ts 
#EXTINF:1.0,
Adsegment3.ts
#EXT-X-ENDLIST
```

You can't use multiple `CUE-OUT/IN` tags in succession to mimic ad pod behavior. This is because `CUE-OUT/IN` tags must be explicitly attached to a segment. 

For example, the following declaration is invalid.

```
#EXT-X-CUE-OUT: 0
#EXT-X-CUE-IN
#EXT-X-CUE-OUT: 0
#EXT-X-CUE-IN
#EXT-X-CUE-OUT: 0
#EXT-X-CUE-IN
#EXTINF:4.000,
Videocontent.ts
```

The following declaration is valid.

```
#EXT-X-CUE-OUT: 0
#EXT-X-CUE-IN
#EXTINF:4.000,
Somecontent1.ts
#EXT-X-CUE-OUT: 0
#EXT-X-CUE-IN
#EXTINF:4.000,
Somecontent2.ts
#EXT-X-CUE-OUT: 0
#EXT-X-CUE-IN
#EXTINF:4.000,
Videocontent.ts
```

The preceding declaration results in an output like the following. 

```
Ad 1
Somecontent.ts
Ad 2
Somecontent2.ts
Videocontent.ts
Post-Roll Ad 3
```
