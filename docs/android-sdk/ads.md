---
title: Ads
sidebar_label: Ads
description: Show VAST and VMAP ads with the Veeplay Android SDK, using the native engine or Google IMA.
---

The SDK shows video ads as prerolls (before the content), midrolls (during the content) and postrolls (after it), plus non-linear overlay ads. Ads are described by VAST tags or a VMAP playlist, and you can configure them in JSON or in code. If your app does not show ads, you do not need anything on this page.

## Choose an ad engine

Two engines can play your ads. Both read the same configuration.

| | Native engine (default) | Google IMA |
| --- | --- | --- |
| Enable with | `setPreferGoogleIma(false)` (the default) | `setPreferGoogleIma(true)` |
| VAST / VMAP | Parsed and played by Veeplay | Requested and played by the Google IMA SDK 3.40 |
| Non-linear (overlay) ads | Supported | Not supported |
| Google Cast | Ads play on the Cast receiver | Ads play on the phone |

```java
APSMediaPlayer player = APSMediaPlayer.getInstance();
player.init(this, false);
player.setPreferGoogleIma(true); // or false for the native engine
```

Call `setPreferGoogleIma()` before the ad breaks are triggered, ideally right after `init()` while you configure the player. Set it each time you configure the player, before you play the playlist. `finish()` discards the player and its settings, so apply it again after the next `init()`.

## Add ads with JSON

Ads sit next to `content` in the [JSON configuration](/json-configuration/). A preroll, a midroll and a postroll look like this:

```json
{
  "content": [
    { "url": "https://example.com/video.m3u8", "autoplay": true }
  ],
  "ads": {
    "adBreaks": {
      "preContent": [
        { "urls": ["https://ads.example.com/preroll.xml"] }
      ],
      "midContent": [
        { "urls": ["https://ads.example.com/midroll.xml"], "offset": "00:00:30" }
      ],
      "postContent": [
        { "urls": ["https://ads.example.com/postroll.xml"] }
      ]
    }
  }
}
```

A midroll `offset` takes a time (`"00:00:30"`), a percentage of the content duration (`"50%"`) or `"#1"` for the first entry of `defaultAdBreakPositions`. An offset in any other form makes the player place the break itself.

To drive all breaks from a VMAP playlist instead, give its URL:

```json
{
  "content": [
    { "url": "https://example.com/video.m3u8", "autoplay": true }
  ],
  "ads": {
    "vmap": "https://ads.example.com/vmap.xml"
  }
}
```

The full list of ad options, including skip buttons, countdowns and multi-ad policies, is in the [JSON configuration reference](/json-configuration/).

Load the configuration and play it exactly as in the [Quick start](quick-start.md). Keep in mind that `mediaUnits()` downloads the VMAP when `ads.vmap` is set, and with `mediaUnits(true)` it also loads the preroll ads, so call it on a background thread as shown there.

## Add ads in code

Ad breaks are `APSVastAdBreak` objects. A preroll is added to the playlist before the content:

```java
import com.appscend.media.events.APSVastAdBreak;

APSVastAdBreak preroll = new APSVastAdBreak();
preroll.type = APSVastAdBreak.APSVASTConfigurationOptions.APSVASTPreContent;
preroll.addSource("https://ads.example.com/preroll.xml");
preroll.allowMultipleAds = true;
preroll.followWrappers = true;
preroll.adOffset = "0";
preroll.setDefaultSkipOffset(5);

ArrayList<APSMediaEvent> units = new ArrayList<>();
units.add(preroll);
units.add(contentUnit); // your APSMediaUnit, see the Quick start
APSMediaPlayer.getInstance().playMediaUnits(units);
```

A postroll uses `APSVASTPostContent` and is added to the playlist after the content in the same way. Midrolls and non-linear breaks (`APSVASTMidContent`, `APSVASTNonLinear`) belong to the content, so attach them to the content unit, with a start point in seconds or as a percentage:

```java
APSVastAdBreak midroll = new APSVastAdBreak();
midroll.type = APSVastAdBreak.APSVASTConfigurationOptions.APSVASTMidContent;
midroll.addSource("https://ads.example.com/midroll.xml");
midroll.adOffset = "00:00:30";
midroll.setStartPoint("30");
midroll.preloadInterval = 10;
contentUnit.addEvent(midroll);
```

The setters on `APSVastAdBreak` control the skip button, countdown text and banner appearance. The [API reference](api-reference.md) lists them all.

## Ad requests and timing

- The next playlist-level break (a preroll for the next item, or a postroll) is requested about 10 seconds before the current content ends, so it is ready when it is needed. Breaks that you build in code are requested at the cue unless you set `preloadInterval = 10` on them, as in the midroll example above.
- With IMA, a break is prepared before its cue, so the ad starts without a wait. Your ad server sees the request a little earlier than the ad plays. A break dropped by a seek, or by leaving inside that window, costs an ad request with no impression.
- Breaks that share an offset (ad pods in a VMAP) play one after another, with the content paused between them.
- The screen stays on while an IMA preroll, midroll or postroll is showing.

## Listen for ad events

Implement `APSMediaPlayerTrackingEventListener` and register it to follow the ad lifecycle (`ADBREAK_LOAD`, `AD_REQUESTED`, `ADBREAK_TRIGGERED` and others):

```java
import android.os.Bundle;
import com.appscend.media.APSMediaTrackingEvents.MediaEventType;
import com.appscend.utilities.APSMediaPlayerTrackingEventListener;

public class PlayerActivity extends AppCompatActivity
        implements APSMediaPlayerTrackingEventListener {

    @Override
    public void onTrackingEventReceived(MediaEventType type, Bundle additionalInfo) {
        if (type == MediaEventType.ADBREAK_TRIGGERED) {
            // an ad break has started
        }
    }
}
```

Register with `APSMediaPlayer.getInstance().addTrackingEventListener(this)` and remove the listener in `onDestroy()` (see [Quick start](quick-start.md)). The event names are listed in the [events reference](/docs/video-player/events#android-sdk-event-support).

## Protected video and screenshots

By default, video is rendered on a secure surface, so content and IMA ads appear black in screenshots, screen recordings and screen captures. This protects your content, and it needs no action.

If your app must allow capturing, turn it off before `init()`:

```java
APSMediaPlayer.getInstance().setSecureSurfaceView(false);
```

This setting applies to content and to IMA ads together.

## Limitations

- **Google IMA does not render non-linear (overlay) ads.** IMA reports `VAST_TRAFFICKING_ERROR` 200 ("nonlinear is not supported"). If you need non-linear ads, use the native engine with `setPreferGoogleIma(false)`.
- **IMA ads always play on the device.** While casting, the content plays on the Cast receiver and IMA ads play on the phone. Ads from the native engine play on the receiver. See [Google Cast](google-cast.md).
- An IMA break starts its ads only while playback is not paused. If its ads finish loading while the viewer has paused (or the app is in the background), IMA reports an ad it cannot play when playback resumes, and not at all if the viewer leaves the player first.

## Permissions added by IMA

The Google IMA SDK adds these permissions to your merged manifest: `AD_ID`, `ACCESS_ADSERVICES_ATTRIBUTION`, `ACCESS_ADSERVICES_AD_ID` and `AD_SERVICES_CONFIG`. Apps that already use the Google Mobile Ads SDK declare `AD_ID` themselves. If you would rather not declare them, remove them with `tools:node="remove"` and check your advertising ID declaration in the Play Console. Removing `AD_ID` means that on Android 13 and higher the advertising ID reads as zeros, so IMA ad requests carry no ID. See [Privacy](privacy.md).
