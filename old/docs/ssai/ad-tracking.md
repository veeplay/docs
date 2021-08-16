# Ad Tracking & Reporting

Veeplay supports both server-side ad reporting (where Veeplay tracks the ad and sends beacons from our content servers directly) or client-side tracking (the Veeplay HTML, iOS or Android player tracks the ad and sends beacons from the user's device).

## Server-side Reporting

Veeplay defaults to server-side reporting. With server-side reporting, when the player requests an ad URL from the manifest, the service reports ad consumption directly to the ad tracking URL. After the player initializes a playback session with Veeplay, no further input is required from the player to perform server-side reporting. As each ad is played back, Veeplay sends VAST-compatible beacons to the ad server to report how much of the ad has been viewed (start of the ad as well as the ad progression in quartiles: the first quartile, midpoint, third quartile, and ad completion).

To perform server-side ad reporting, simply playback your HLS/DASH stream using any compatible player. When the player requests playback from an ad segment URL (`/v1/segment` path), Veeplay sends the appropriate beacon to the ad server through the ad tracking URLs.

## Client-side Reporting

Configuring the front-end Veeplay player SDKs to work with SSAI URLs only entails specifying a unit manager when defining the main content. Snippets for programatic as well as JSON configuration methods are outlined below.

### Veeplay SDK JSON configuration

```json
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
```

### Veeplay SDK for Android configuration

```java
APSMediaUnit ssaiUnit = new APSMediaUnit();
ssaiUnit.url = "<SSAI_URL>";
ssaiUnit.manager = SsaiClient.managerIdentifier;
ArrayList<APSMediaEvent> mediaUnits = new ArrayList<>();
mediaUnits.add(ssaiUnit);
APSMediaPlayer.getInstance().playMediaUnits(mediaUnits);
```

### Veeplay SDK for iOS configuration

```objc
APSMediaUnit *ssaiUnit = [[APSMediaUnit alloc] initWithURL:[NSURL URLWithString:@"<SSAI_URL>"]];
ssaiUnit.managerType = APSSSAIClientType;
[[APSMediaPlayer sharedInstance] playMediaUnits:@[ssaiUnit]];
```