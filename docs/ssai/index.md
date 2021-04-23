# Veeplay Dynamic Ad Insertion

Server side ad insertion is a modern streaming technique that minimizes buffering times and helps with avoiding lost ad inventory to client-side ad blockers.

This is accomplished by leveraging popular adaptive streaming protocols like HLS or DASH, creating a unified streaming manifest that contains both ad as well as main content.

When a request for a SSAI enabled streaming URL is made, our backend systems will ping pre-configured VAST ad servers and a manifest is generated on the fly, leveraging all available targeting data. This ensures that only the most relevant ads are still delivered to users.

Whenever new ad creatives are returned by the downstream ad servers, these ads are transcoded on the fly so that they match the variants of the original content.

Since ads are now part of the video stream, video players need additional feedback in order to determine whether an ad is currently rendered, and adapt the UI accordingly. Veeplay 3.x player SDKs for HTML, Android, and iOS support client-side reporting out of the box. The SDKs will handle all ad tracking and overlays on the client-side automatically.

See [the ad behavior docs](ad-behavior.md) for more info.

> Our backend can also automatically process ad-server tracking server-side, according to the VAST standard, making this integration scenario essentially a drop-in replacement.

## Preparing your content

In order to be able to use existing content sources with SSAI, incoming content needs to follow a set of requirements:

 - Formatted in `HLS` (Apple HTTP Live Streaming) or in `DASH` (MPEG Dynamic Adaptive Streaming over HTTP);
 - Is live content, or video-on-demand (VOD);
 - Is accessible on the public internet and has a public IP address;
 - Contains ad markers to delineate ad breaks in the content.

 > Read the full [HLS specifications](manifest-hls.md) and [DASH specifications](manifest-dash.md).

 > Learn how Veeplay handles [multiple audio and subtitle streams](manifest-audio-captions.md).

In order to know where inside the stream ads should be injected, the system relies on either `SCTE-35` markers or `VMAP 1.0` responses from the downstream ad-server. If neither are provided, the ads will be injected as pre-rolls at the beginning of the stream.

> Read the full [ad marker specification for HLS](manifest-hls.md#hls-supported-ad-markers) and the full [ad marker specification for DASH](manifest-dash.md#dash-ad-markers).

Veeplay also provides a pipeline that helps with transcoding your content (streams/ad responses), or allows for different ways of accessing the SSAI processor. Please contact your Veeplay representative to learn more.

## Generating SSAI streaming URLs using the Veeplay Panel

> Read more on [creating a configuration](creating-a-configuration.md).

Once your content is formatted in a compatible playlist the SSAI streaming URLs can be generated.

In order to do this, navigate to `https://panel.veeplay.com` and login using your Veeplay credentials. All SSAI settings are grouped inside the `SSAI` tab on the main menu.

Fill in the following inputs:

- `VAST URL` - this is the endpoint that will be polled whenever the stream is requested. Our backend will expect that the response at this URL will either be a VAST tag, or a VMAP tag in case you're looking to use VMAP in order to schedule ad breaks.
- `HLS or DASH content URL` - this is the base URL of your CDN where HLS or DASH manifests are stored. Do not point directly to one of your manifests, just to the folder where these are stored. The name of the manifest should be appended to the generated links.
- `Slate MP4 URL` - this is an optional MP4 slate that is used to fill gaps in media content. See [slate management](slate-management.md) for more info.

> Read the full [HLS specifications](manifest-hls.md) and [DASH specifications](manifest-dash.md).

> Read the full specs on [using VAST, VMAP and VPAID](vast-vmap-vpaid.md).

> Learn how to [send variables to the ad server](variables.md).

After clicking `Save`, a set of 2 base URLs will be generated. You can append the name of any manifest available at the original URL in order to get links to specific streams on your CDN.

- a server side only HLS endpoint, usable with any HLS enabled player
- a server side only DASH endpoint, usable with any DASH enabled player

> Read more about [monitoring your streams](monitoring.md).

## Client SDK configuration for SSAI

Configuring the front-end libraries to work with SSAI URLs only entails specifying a unit manager when defining the main content. Snippets for programatic as well as JSON configuration methods are outlined below. See [the ad tracking docs](ad-tracking.md) for more info.

### Veeplay SDK JSON configuration

````json
{
  "content": [
    {
      "manager": "veeplay-ssai-client",
      "url": "<SSAI-URL>",
      "autoplay": true,
      "controls": {
        "components": [
          "playback",
          "totalTime",
          "slider",
          "currentTime",
          "fullscreen"
        ]
      }
    }
  ]
}
````

### Veeplay SDK for Android configuration

````java
APSMediaUnit ssaiUnit = new APSMediaUnit();
ssaiUnit.url = "<SSAI_URL>";
ssaiUnit.manager = SsaiClient.managerIdentifier;
ArrayList<APSMediaEvent> mediaUnits = new ArrayList<>();
mediaUnits.add(ssaiUnit);
APSMediaPlayer.getInstance().playMediaUnits(mediaUnits);
````

### Veeplay SDK for iOS configuration

````objc
APSMediaUnit *ssaiUnit = [[APSMediaUnit alloc] initWithURL:[NSURL URLWithString:@"<SSAI_URL>"]];
ssaiUnit.managerType = APSSSAIClientType;
[[APSMediaPlayer sharedInstance] playMediaUnits:@[ssaiUnit]];
````
