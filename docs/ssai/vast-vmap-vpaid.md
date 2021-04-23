# VAST/VMAP/VPAID Support

Veeplay supports VAST 3.0 and 2.0 and VMAP 1.0 for server-side ad insertion.

For IAB specifications, see the following:
+ VAST 3.0 – [https://www\.iab\.com/guidelines/digital\-video\-ad\-serving\-template\-vast\-3\-0/](https://www.iab.com/guidelines/digital-video-ad-serving-template-vast-3-0/)
+ VMAP 1.0 – [https://www\.iab\.com/guidelines/digital\-video\-multiple\-ad\-playlist\-vmap\-1\-0\-1/](https://www.iab.com/guidelines/digital-video-multiple-ad-playlist-vmap-1-0-1/)
+ VPAID – [https://www\.iab\.com/guidelines/digital\-video\-player\-ad\-interface\-definition\-vpaid\-2\-0/](https://www.iab.com/guidelines/digital-video-player-ad-interface-definition-vpaid-2-0/)

> To enable VPAID support, contact your Veeplay account representative.

To integrate your ad server with Veeplay, your ad server must send XML that conforms to the IAB specifications for the supported versions of VAST and VMAP. You can use a public VAST validator to ensure that your tags are well-formed.

> Your ad server's VAST response must contain IAB compliant `TrackingEvents` elements and standard event types, like `impression`. If you don't include standard tracking events, Veeplay rejects the VAST response and doesn't provide an ad for the avail.

VAST 3.0 introduced support for ad pods, which is the delivery of a set of sequential linear ads. If a specific ad in an ad pod is not available, Veeplay logs an error and then tries to insert the next ad in the pod.

## Ad Calls

Veeplay calls your VAST ads URL as defined in your configuration. It substitutes any player-specific or session-specific parameters when making the ad call.

Veeplay follows up to three levels of VAST wrappers and redirects in the VAST response. In live streaming scenarios, Veeplay makes ad calls simultaneously at the ad avail start for connected players. In practice, due to jitter, these ad calls can be spread out over a few seconds. Make sure that your ad server can handle the number of concurrent connections this type of calling requires.

Veeplay doesn't currently support pre-fetching VAST responses.

## Creative Handling

When Veeplay receives the VAST response, for each creative it identifies the highest bitrate `MediaFile` for transcoding and uses this as its source. It sends this file to the on-the-fly transcoder for transformation into renditions that fit the player's master manifest bitrates and resolutions.

> For best results, make sure that your highest bitrate media file is a high-quality MP4 asset with valid manifest presets. When manifest presets aren't valid, the transcode jobs fail, resulting in no ad shown. Examples of presets that aren't valid include unsupported input file formats, like ProRes, and certain rendition specifications, like the resolution 855X481. 

**Creative Indexing**  
Veeplay uniquely indexes each creative by the value of the `id` attribute provided in the `<Creative>` element. If a creative's ID is not specified, Veeplay uses the media file URL for the index.

The following example declaration shows the creative ID.

```
<Creatives>
    <Creative id="57859154776" sequence="1">
```

If you define your own creative IDs, use a new, unique ID for each creative. Don't reuse creative IDs. Veeplay stores creative content for repeated use, and finds each by its indexed ID. When a new creative comes in, the service first checks its ID against the index. If the ID is present, Veeplay uses the stored content, rather than reprocessing the incoming content. If you reuse a creative ID, Veeplay uses the older, stored ad and doesn't play your new ad. 