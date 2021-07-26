---
title: Video Player Events Reference
description: Tracking events with the Veeplay Video Player.
---

## Event Description & Availability

The Veeplay Video Player event tracking system is designed to support two use cases:
- Provide hooks for programmatic access to player and media lifecycle events;
- Log all events to one or more tracking servers for analytics and audit purposes.

The available events are a superset of the official [IAB VAST Tracking Events](https://iabtechlab.com/wp-content/uploads/2019/06/VAST_4.2_final_june26.pdf), allowing for simple VAST ad integration. Remote tracking is configured automatically for media units built using VAST or VMAP, but can also be configured programatically on each platform.

| Event Name                               | Triggered                                                                                           | JS Support | iOS Support | Android Support |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- | :--------: | :---------: | :-------------: |
| Launch                                   | When a media unit or overlay begins processing, even if there is no content to display.             |     ☑     |     ☑      |       ☑        |
| Start                                    | When a video (or an individual creative within an ad) was loaded and playback began                 |     ☑     |     ☑      |       ☑        |
| Finish                                   | When a media unit or overlay finishes processing, even if there was no content to display.          |     ☑     |     ☑      |       ☑        |
| Playlist Finished                        | When the current playlist finishes.                                                                 |     ☑     |     ☑      |       ☑        |
| Exit Fullscreen                          | When the player exits fullscreen mode.                                                              |     ☑     |     ☑      |       ☑        |
| Enter Fullscreen                         | When the player enters fullscreen mode.                                                             |     ☑     |     ☑      |       ☑        |
| Toggle Fullscreen                        | When the player's fullscreen status changes.                                                        |     ☑     |     ☑      |                 |
| Impression                               | When the first frame of a video or the content of an overlay is displayed.                          |     ☑     |     ☑      |       ☑        |
| Viewable Impression                      | When the content meets the criteria for a viewable video impression.                                |            |     ☑      |       ☑        |
| Impression Not Viewable                  | When the content does not meet the criteria for a viewable video impression.                        |            |     ☑      |       ☑        |
| Impression With Undetermined Viewability | When the criteria for a viewable video impression cannot be determined.                             |            |     ☑      |       ☑        |
| Creative View                            | When an individual creative portion of an ad is     viewed.                                         |     ☑     |     ☑      |       ☑        |
| Pause                                    | When the video is paused.                                                                           |     ☑     |     ☑      |       ☑        |
| Resume                                   | When the video playback resumes after a pause.                                                      |     ☑     |     ☑      |       ☑        |
| Rewind                                   | When the video is seeked backward.                                                                  |     ☑     |     ☑      |       ☑        |
| Forward                                  | When the video is seeked forward.                                                                   |     ☑     |     ☑      |       ☑        |
| Mute                                     | When the player is muted.                                                                           |     ☑     |     ☑      |       ☑        |
| Unmute                                   | When the player is unmuted.                                                                         |     ☑     |     ☑      |       ☑        |
| Error                                    | When an error is encountered.                                                                       |     ☑     |     ☑      |       ☑        |
| Complete                                 | When a video is played until the end, or an overlay is displayed for the entire scheduled duration. |     ☑     |     ☑      |       ☑        |
| Close                                    | When a video is stopped or an overlay is closed by the user.                                        |     ☑     |     ☑      |       ☑        |
| Video Close                              | When a video is stopped by the user.                                                                |     ☑     |     ☑      |       ☑        |
| Skip                                     | When a video is skipped (via the skip overlay)..                                                    |     ☑     |     ☑      |       ☑        |
| Click                                    | When an ad is clicked (via the button overlay).                                                     |     ☑     |     ☑      |       ☑        |
| Icon View                                | When an industry icon is displayed.                                                                 |     ☑     |     ☑      |                 |
| Ad Expand                                | When a MRAID ad is expanded.                                                                        |            |     ☑      |                 |
| Ad Collapse                              | When a MRAID ad is collapsed.                                                                       |            |     ☑      |                 |
| Position                                 | On SSAI ad progress (first quartile, midpoint, third quartile).                                     |     ☑     |     ☑      |       ☑        |
| Seeked                                   | After video was seeked.                                                                             |     ☑     |     ☑      |                 |
| SSAI Ad Started                          | When a SSAI ad starts.                                                                              |     ☑     |     ☑      |       ☑        |
| SSAI Ad Ended                            | When a SSAI ad ends.                                                                                |     ☑     |     ☑      |       ☑        |
| Ad Break Started                         | When an ad break starts processing.                                                                 |            |     ☑      |                 |
| Ad Requested                             | When a VAST tag is requested from the network.                                                      |            |     ☑      |                 |
| Unit Finished                            | When a media unit finishes processing.                                                              |     ☑     |     ☑      |       ☑        |
| Invalid License                          | When there is an issue with the player commercial license.                                          |     ☑     |     ☑      |       ☑        |
| Playback Status Change                   | When the player playback status changes.                                                            |     ☑     |     ☑      |       ☑        |
| Load State Change                        | When a video load state changes.                                                                    |     ☑     |     ☑      |       ☑        |
| Unit Started                             | When a media unit starts processing.                                                                |            |             |       ☑        |
| Playback Requested                       | When video content is requested from the network.                                                   |            |             |       ☑        |
| Player Tapped                            | When the player surface is clicked/tapped.                                                          |     ☑     |     ☑      |                 |
| Controls Displayed                       | When the video controls are displayed.                                                              |     ☑     |     ☑      |                 |
| Controls Hidden                          | When the video controls are hidden.                                                                 |     ☑     |     ☑      |                 |
| Update                                   | Every seconds, while the player is running.                                                         |     ☑     |     ☑      |       ☑        |
| Event Tracked                            | When an event was tracked to a remote server.                                                       |     ☑     |     ☑      |                 |
| Will Open Browser                        | When the user clicks on an ad, triggering an in-app browser to open.                                |            |     ☑      |                 |
| Will Close Browser                       | When the user closes the in-app browser.                                                            |            |     ☑      |                 |
| Duration Available                       | When the duration of the current video is available.                                                |     ☑     |     ☑      |                 |
| Volume Changed                           | When the audio volume changes.                                                                      |     ☑     |     ☑      |                 |
| Mouse Move                               | When the mouse is moved on top of the video player surface.                                         |     ☑     |             |                 |

## JavaScript SDK Event Support

### Subscribing to Notifications and Events

If you've installed Veeplay using NPM, import the notifications and events from the main entrypoint:

```js
import { MediaPlayer, NOTIFICATIONS, EVENTS } from 'veeplay'
```

If you've installed Veeplay using the CDN links, `NOTIFICATIONS` and `EVENTS` will be globally available.

The player uses an `EventEmitter` instance for propagating player events. The instance is unique per each player object and can be accessed using the following method:

```js
const tracker = player.getEventTracker()
```

In order to subscribe to notifications, use the event emitter:

```js
tracker.emitter.on(
  NOTIFICATIONS.ENTER_FULLSCREEN,
  () => console.log('fullscreen mode on'),
);
```

In order to hook into events, subscribe to the `trackedEvent` notification and read the attached event:

```js
tracker.emitter.on('trackedEvent', (e) => {
  if (e.event === EVENTS.PAUSE) {
    console.log('paused');
  } else if (e.event === EVENTS.RESUME) {
    console.log('resumed');
  }
});
```

See the full documentation on [notifications](https://docs.veeplay.com/javascript-player/global.html#NOTIFICATIONS) and [events](https://docs.veeplay.com/javascript-player/global.html#EVENTS).

### Event and Notification Names

| Event Name                               | Event             | Notification             |
| ---------------------------------------- | ----------------- | ------------------------ |
| Launch                                   | `LAUNCH`          |                          |
| Start                                    | `START`           |                          |
| Finish                                   | `FINISH`          |                          |
| Playlist Finished                        |                   | `PLAYLIST_FINISH`        |
| Exit Fullscreen                          | `EXIT_FULLSCREEN` | `EXIT_FULLSCREEN`        |
| Enter Fullscreen                         | `FULLSCREEN`      | `ENTER_FULLSCREEN`       |
| Toggle Fullscreen                        |                   | `TOGGLE_FULLSCREEN`      |
| Impression                               | `IMPRESSION`      |                          |
| Viewable Impression                      |                   |                          |
| Impression Not Viewable                  |                   |                          |
| Impression With Undetermined Viewability |                   |                          |
| Creative View                            | `CREATIVE_VIEW`   |                          |
| Pause                                    | `PAUSE`           |                          |
| Resume                                   | `RESUME`          |                          |
| Rewind                                   | `REWIND`          |                          |
| Forward                                  | `FORWARD`         |                          |
| Mute                                     | `MUTE`            |                          |
| Unmute                                   | `UNMUTE`          |                          |
| Error                                    | `ERROR`           | `ERROR`                  |
| Complete                                 | `COMPLETE`        |                          |
| Close                                    | `CLOSE`           |                          |
| Video Close                              | `CLOSE_LINEAR`    |                          |
| Skip                                     | `SKIP`            |                          |
| Click                                    | `CLICK`           |                          |
| Icon View                                | `ICON_VIEW`       |                          |
| Ad Expand                                |                   |                          |
| Ad Collapse                              |                   |                          |
| Position                                 | `POSITION`        |                          |
| Seeked                                   | `SEEKED`          |                          |
| SSAI Ad Started                          | `SSAI_AD_STARTED` |                          |
| SSAI Ad Ended                            | `SSAI_AD_ENDED`   |                          |
| Ad Break Started                         |                   |                          |
| Ad Requested                             |                   |                          |
| Unit Finished                            |                   | `UNIT_FINISHED`          |
| Invalid License                          |                   | `INVALID_LICENSE`        |
| Playback Status Change                   |                   | `PLAYBACK_STATE_CHANGED` |
| Load State Change                        |                   | `LOAD_STATE_CHANGED`     |
| Unit Started                             |                   |                          |
| Playback Requested                       |                   |                          |
| Player Tapped                            |                   | `PLAYER_TAPPED`          |
| Controls Displayed                       |                   | `CONTROLS_DISPLAYED`     |
| Controls Hidden                          |                   | `CONTROLS_HIDDEN`        |
| Update                                   | `UPDATE`          | `PLAYER_UPDATE`          |
| Event Tracked                            |                   | `TRACKED_EVENT`          |
| Will Open Browser                        |                   |                          |
| Will Close Browser                       |                   |                          |
| Duration Available                       |                   | `DURATION_AVAILABLE`     |
| Volume Changed                           |                   | `VOLUME_CHANGED`         |
| Mouse Move                               |                   | `PLAYER_MOUSE_MOVE`      |

## iOS SDK Event Support

### Subscribing to Notifications and Events

Use the Notification Center API to subscribe to notifications:

```swift
NotificationCenter.default.addObserver(self, selector: #selector(onUnitFinished(_:)), name: Notification.Name(rawValue: APSMediaPlayerUnitFinishedNotification), object: nil)
...
@objc func onUnitFinished(_ notification: Notification) {
    ...
}
```

You subscribe to events by subscribing to the `APSMediaPlayerTrackedEventNotification`, and consuming the data in the `userInfo` dictionary:

```swift
NotificationCenter.default.addObserver(self, selector: #selector(onUnitFinished(_:)), name: Notification.Name(rawValue: APSMediaPlayerUnitFinishedNotification), object: nil)
...
@objc func onUnitFinished(_ notification: Notification) {
    if let info = notification.userInfo as [String:String]? {
      if let type = info[kAPSMediaPlayerEventType] as String? {
        print(type)
      }
    }
}
```

Read the `APSMediaPlayer` [class documentation](https://docs.veeplay.com/ios-player/Classes/APSMediaPlayer.html) for more info on subscribing to and consuming notifications.

### Event and Notification Names

| Event Name                               | Event                                               | Notification                                                                                    |
| ---------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Launch                                   | `APSMediaPlayerEventLaunch`                         |                                                                                                 |
| Start                                    | `APSMediaPlayerEventStart`                          |                                                                                                 |
| Finish                                   | `APSMediaPlayerEventFinish`                         |                                                                                                 |
| Playlist Finished                        | `APSMediaPlayerEventPlaylistFinish`                 |                                                                                                 |
| Exit Fullscreen                          | `APSMediaPlayerEventExitFullscreen`                 | `APSMediaPlayerWillExitFullscreenNotification`, `APSMediaPlayerDidExitFullscreenNotification`   |
| Enter Fullscreen                         | `APSMediaPlayerEventFullscreen`                     | `APSMediaPlayerWillEnterFullscreenNotification`, `APSMediaPlayerDidEnterFullscreenNotification` |
| Toggle Fullscreen                        |                                                     | `APSMediaPlayerToggleFullscreenNotification`                                                    |
| Impression                               | `APSMediaPlayerEventImpression`                     |                                                                                                 |
| Viewable Impression                      | `APSMediaPlayerEventViewableImpressionViewable`     |                                                                                                 |
| Impression Not Viewable                  | `APSMediaPlayerEventViewableImpressionNotViewable`  |                                                                                                 |
| Impression With Undetermined Viewability | `APSMediaPlayerEventViewableImpressionUndetermined` |                                                                                                 |
| Creative View                            | `APSMediaPlayerEventCreativeView`                   |                                                                                                 |
| Pause                                    | `APSMediaPlayerEventPause`                          |                                                                                                 |
| Resume                                   | `APSMediaPlayerEventResume`                         |                                                                                                 |
| Rewind                                   | `APSMediaPlayerEventRewind`                         |                                                                                                 |
| Forward                                  | `APSMediaPlayerEventForward`                        |                                                                                                 |
| Mute                                     | `APSMediaPlayerEventMute`                           |                                                                                                 |
| Unmute                                   | `APSMediaPlayerEventUnmute`                         |                                                                                                 |
| Error                                    | `APSMediaPlayerEventError`                          | `APSMediaPlayerErrorNotification`                                                               |
| Complete                                 | `APSMediaPlayerEventComplete`                       |                                                                                                 |
| Close                                    | `APSMediaPlayerEventClose`                          |                                                                                                 |
| Video Close                              | `APSMediaPlayerEventCloseLinear`                    |                                                                                                 |
| Skip                                     | `APSMediaPlayerEventSkip`                           |                                                                                                 |
| Click                                    | `APSMediaPlayerEventClick`                          |                                                                                                 |
| Icon View                                | `APSMediaPlayerEventIconView`                       |                                                                                                 |
| Ad Expand                                | `APSMediaPlayerEventExpand`                         |                                                                                                 |
| Ad Collapse                              | `APSMediaPlayerEventCollapse`                       |                                                                                                 |
| Position                                 | `APSMediaPlayerEventPosition`                       |                                                                                                 |
| Seeked                                   | `APSMediaPlayerEventSeeked`                         |                                                                                                 |
| SSAI Ad Started                          | `APSMediaPlayerEventSSAIAdStarted`                  |                                                                                                 |
| SSAI Ad Ended                            | `APSMediaPlayerEventSSAIAdEnded`                    |                                                                                                 |
| Ad Break Started                         | `APSMediaPlayerEventAdBreakTriggered`               |                                                                                                 |
| Ad Requested                             | `APSMediaPlayerEventAdRequested`                    |                                                                                                 |
| Unit Finished                            |                                                     | `APSMediaPlayerUnitFinishedNotification`                                                        |
| Invalid License                          |                                                     | `APSMediaPlayerInvalidLicenseNotification`                                                      |
| Playback Status Change                   |                                                     | `APSMediaPlayerStatusChangedNotification`, `APSMediaPlayerPlaybackStateDidChangeNotification`   |
| Load State Change                        |                                                     | `APSMediaPlayerLoadStateDidChangeNotification`                                                  |
| Unit Started                             |                                                     |                                                                                                 |
| Playback Requested                       |                                                     |                                                                                                 |
| Player Tapped                            |                                                     | `APSMediaPlayerWasTappedNotification`                                                           |
| Controls Displayed                       |                                                     | `APSMediaPlayerControlsDisplayedNotification`                                                   |
| Controls Hidden                          |                                                     | `APSMediaPlayerControlsHiddenNotification`                                                      |
| Update                                   | `APSMediaPlayerEventUpdate`                         | `APSMediaPlayerUpdateNotification`                                                              |
| Event Tracked                            |                                                     | `APSMediaPlayerTrackedEventNotification`                                                        |
| Will Open Browser                        |                                                     | `APSMediaPlayerWillOpenMiniBrowser`                                                             |
| Will Close Browser                       |                                                     | `APSMediaPlayerWillCloseMiniBrowser`                                                            |
| Duration Available                       |                                                     | `APSMediaPlayerDurationAvailableNotification`                                                   |
| Volume Changed                           |                                                     | `APSMediaPlayerVolumeDidChangeNotification`                                                     |
| Mouse Move                               |                                                     |                                                                                                 |

## Android SDK Event Support

### Subscribing to Events

The `APSMediaEvents` class defines the events that the Veeplay player emits. In order to receive events, implement the `APSMediaPlayerTrackingEventListener` interface, and register the listener with the Veeplay Player.

```java 
public class FullscreenActivity extends FragmentActivity implements APSMediaPlayerTrackingEventListener {
  ...
  @Override
  public void onTrackingEventReceived(MediaEventType type,
      ArrayList urls, String description) {           
    if(type == APSMediaEvents.MediaEventType.FULLSCREEN) 
      Toast.makeText(FullscreenActivity.this, "Fullscreen entered", Toast.LENGTH_SHORT).show();
    else if(type == APSMediaEvents.MediaEventType.EXIT_FULLSCREEN)
      Toast.makeText(FullscreenActivity.this, "Fullscreen exited", Toast.LENGTH_SHORT).show();
  }
}
```        

When initializing the player (or any time you wish to start receiving events):

```java
APSMediaPlayer.getInstance().addTrackingEventListener(this);
```

When you no longer want to receive events:

```java 
APSMediaPlayer.getInstance().removeTrackingEventListener(this);
```

### Event Names

| Event Name                               | Event                                |
| ---------------------------------------- | ------------------------------------ |
| Launch                                   | `LAUNCH`                             |
| Start                                    | `START`                              |
| Finish                                   | `FINISH`                             |
| Playlist Finished                        | `PLAYLIST_FINISHED`                  |
| Exit Fullscreen                          | `EXIT_FULLSCREEN`                    |
| Enter Fullscreen                         | `FULLSCREEN`                         |
| Toggle Fullscreen                        |                                      |
| Impression                               | `IMPRESSION`                         |
| Viewable Impression                      | `VIEWABLE_IMPRESSION_VIEWABLE`       |
| Impression Not Viewable                  | `VIEWABLE_IMPRESSION_NOT_VIEWABLE`   |
| Impression With Undetermined Viewability | `VIEWABLE_IMPRESSION_UNDETERMINED`   |
| Creative View                            | `CREATIVE_VIEW`                      |
| Pause                                    | `PAUSE`, `USER_PAUSE`                |
| Resume                                   | `RESUME`, `USER_UNPAUSE`             |
| Rewind                                   | `REWIND`                             |
| Forward                                  | `FORWARD`                            |
| Mute                                     | `MUTE`                               |
| Unmute                                   | `UNMUTE`                             |
| Error                                    | `ERROR`                              |
| Complete                                 | `COMPLETE`                           |
| Close                                    | `CLOSE`                              |
| Video Close                              | `CLOSE_LINEAR`                       |
| Skip                                     | `SKIP`                               |
| Click                                    | `CLICK`                              |
| Icon View                                |                                      |
| Ad Expand                                |                                      |
| Ad Collapse                              |                                      |
| Position                                 | `POSITION`                           |
| Seeked                                   |                                      |
| SSAI Ad Started                          | `SSAI_AD_STARTED`                    |
| SSAI Ad Ended                            | `SSAI_AD_ENDED`                      |
| Ad Break Started                         |                                      |
| Ad Requested                             |                                      |
| Unit Finished                            | `UNIT_FINISHED`, `UNIT_FINISHED_URL` |
| Invalid License                          | `LICENSE_INVALID`                    |
| Playback Status Change                   | `PLAYBACK_STATE_CHANGED`             |
| Load State Change                        | `BUFFER_START`, `BUFFER_END`         |
| Unit Started                             | `START_PROCESSING_NEW_UNIT`          |
| Playback Requested                       | `PLAYBACK_REQUESTED`                 |
| Player Tapped                            |                                      |
| Controls Displayed                       |                                      |
| Controls Hidden                          |                                      |
| Update                                   | `CLOCK_TICK`                         |
| Event Tracked                            |                                      |
| Will Open Browser                        |                                      |
| Will Close Browser                       |                                      |
| Duration Available                       |                                      |
| Volume Changed                           |                                      |
| Mouse Move                               |                                      |
