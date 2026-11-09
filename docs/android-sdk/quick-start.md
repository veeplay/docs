---
title: Quick start
sidebar_label: Quick start
description: Play your first video with the Veeplay Android SDK.
---

This page shows a complete first player: initialize the SDK in an Activity, add the player view to your layout and play a video. It takes about twenty lines.

## 1. Add a container to your layout

The player is a view that you add to a container of your own. The container decides where the video appears and how large it is:

```xml
<RelativeLayout
    android:id="@+id/player_container"
    android:layout_width="match_parent"
    android:layout_height="220dp" />
```

## 2. Initialize the player and add its view

Call `init()` with your Activity, size the player and add `viewController()` to the container. `APSMediaPlayer` is a singleton: `getInstance()` returns the same player until you call `finish()` (see [step 4](#4-forward-the-activity-lifecycle)), which discards it.

```java
import com.appscend.media.APSMediaPlayer;

public class PlayerActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_player);
        RelativeLayout container = findViewById(R.id.player_container);

        APSMediaPlayer player = APSMediaPlayer.getInstance();
        player.init(this, false);
        player.setSize(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT);

        View playerView = player.viewController();
        if (playerView.getParent() != null) {
            ((ViewGroup) playerView.getParent()).removeView(playerView);
        }
        container.addView(playerView);
    }
}
```

- `init(Activity, boolean)` takes the Activity the player is bound to and whether the height of the system status bar should be taken into account when laying out. Call it as early as you can in the Activity's lifecycle.
- `setSize(width, height)` sizes the player view inside its container. `MATCH_PARENT` makes it fill the container you defined in your layout.
- The check for an existing parent matters when the player view moves between two Activities that are alive at the same time: a view can have only one parent, so detach it before adding it to the new container. When the system recreates an Activity, `init()` builds a new container for the new Activity, and you add that one.

## 3. Play a video

There are three ways to tell the player what to play. Pick the one that suits your app.

### From a JSON string

The player is configured with the [JSON configuration](/json-configuration/) used by all Veeplay players. Pass it to an `APSMediaBuilder`, then hand the resulting playlist to the player:

```java
String json = "{"
        + "\"content\": [{"
        + "  \"url\": \"https://s3.eu-central-1.amazonaws.com/com.veeplay.samples/hls/sintel-h624/Sintel.2010.4k.m3u8\","
        + "  \"autoplay\": true,"
        + "  \"controls\": {\"components\": [\"playback\", \"totalTime\", \"slider\", \"currentTime\", \"fullscreen\"]}"
        + "}]"
        + "}";

APSMediaBuilder builder = new APSMediaBuilder();
builder.configureFromData(json);
ArrayList<APSMediaEvent> units = builder.mediaUnits();
APSMediaPlayer.getInstance().playMediaUnits(units);
```

`mediaUnits()` returns the playlist: your content, plus any ad breaks and bumpers that the configuration describes.

### From a JSON URL

If your configuration lives on a server, use the asynchronous `configureFromURL()`. It downloads and parses the JSON on a background thread and calls you back on the main thread:

```java
private final ExecutorService buildExecutor = Executors.newSingleThreadExecutor();
private final Handler main = new Handler(Looper.getMainLooper());

private void loadAndPlay() {
    final APSMediaBuilder builder = new APSMediaBuilder();
    try {
        builder.configureFromURL(new URL("https://example.com/player.json"), ok -> {
            if (!ok) return;
            buildExecutor.execute(() -> {
                ArrayList<APSMediaEvent> units = builder.mediaUnits();
                main.post(() -> {
                    if (!isFinishing() && !isDestroyed() && APSMediaPlayer.isInitialized()) {
                        APSMediaPlayer.getInstance().playMediaUnits(units);
                    }
                });
            });
        });
    } catch (MalformedURLException e) {
        Log.e("Player", "Invalid configuration URL", e);
    }
}
```

Shut the executor down in `onDestroy()` with `buildExecutor.shutdown()`.

The second step runs on a background thread because `mediaUnits()` can wait for the network: when the configuration has `ads.vmap` it downloads the VMAP, and `mediaUnits(true)` also loads the preroll ads. A configuration without a VMAP does not normally wait for the network there, but the pattern above is safe for every configuration. The check before `playMediaUnits()` drops a result that arrives after the user has left the screen.

`configureFromURL(URL)` without a callback also exists. It blocks the calling thread until the download finishes, so prefer the callback version.

### From code

You can also build the playlist yourself, without any JSON:

```java
APSMediaUnit unit = new APSMediaUnit();
unit.url = "https://s3.eu-central-1.amazonaws.com/com.veeplay.samples/hls/sintel-h624/Sintel.2010.4k.m3u8";

HashMap<String, Object> controls = new HashMap<>();
controls.put(APSMediaPlayerControlsOverlayController.kAPSControlsComponents,
        APSMediaPlayerControlsOverlayController.APSPlaybackControl
                | APSMediaPlayerControlsOverlayController.APSCurrentTimeControl
                | APSMediaPlayerControlsOverlayController.APSTimeSliderControl
                | APSMediaPlayerControlsOverlayController.APSTotalTimeControl
                | APSMediaPlayerControlsOverlayController.APSFullScreenControl);
unit.controlsParameters = controls;

ArrayList<APSMediaEvent> units = new ArrayList<>();
units.add(unit);
APSMediaPlayer.getInstance().playMediaUnits(units);
```

The classes used here are `com.appscend.media.events.APSMediaUnit`, `com.appscend.media.events.APSMediaEvent` and `com.appscend.overlaycontrollers.APSMediaPlayerControlsOverlayController`. The [API reference](api-reference.md) documents their options.

## 4. Forward the Activity lifecycle

Tell the player when your Activity pauses and resumes, and tear it down when the user leaves:

```java
@Override
protected void onPause() {
    super.onPause();
    APSMediaPlayer.getInstance().onActivityPaused();
}

@Override
protected void onResume() {
    super.onResume();
    APSMediaPlayer.getInstance().onActivityResumed();
}

private void quitPlayer() {
    APSMediaPlayer.getInstance().finish();
    finish();
}
```

- While the Activity is paused, nothing starts. A unit that was due to start begins on `onActivityResumed()`, and only a unit that was playing before the pause is resumed.
- Calling `resumePlay()` or `play()` while the Activity is paused is safe: the call is deferred until `onActivityResumed()`.
- `finish()` on the player stops playback, sends the pending tracking events and releases the player's resources. Call it when the user leaves the player for good, for example from your back handler (see [Fullscreen, edge-to-edge and predictive back](fullscreen-and-insets.md)). To use the player again afterwards, call `init()` again.
- `finish()` discards the player. Before the next `init()`, apply your settings again (`setPreferGoogleIma`, `setSecureSurfaceView`, `setGoogleCastEnabled`, `setAdvertisingIdentifier`, `setFullscreenOrientationBehaviour`). `setSessionCookiesEnabled` is static and stays.
- If you added a tracking listener with `addTrackingEventListener()` (see [Ads](ads.md#listen-for-ad-events)), remove it in `onDestroy()`:

```java
@Override
protected void onDestroy() {
    if (APSMediaPlayer.isInitialized()) {
        APSMediaPlayer.getInstance().removeTrackingEventListener(this);
    }
    buildExecutor.shutdown();
    super.onDestroy();
}
```

### When the Activity is recreated

The system can recreate your Activity, for example on rotation. If a playlist is still processing, re-attach the player to the new Activity instead of playing it again:

```java
boolean recreated = savedInstanceState != null
        && APSMediaPlayer.isInitialized()
        && APSMediaPlayer.getInstance().isProcessing();

APSMediaPlayer.getInstance().init(this, false);
View views = APSMediaPlayer.getInstance().viewController();
if (views.getParent() != null) ((ViewGroup) views.getParent()).removeView(views);
container.addView(views);

if (!recreated) {
    // build and play the playlist, as shown above
}
```

`init()` with the new Activity moves the SDK's views to it. You only need to attach `viewController()` again.

## 5. Edge-to-edge layouts (targetSdk 35 and higher)

If your app targets Android 15 (API 35) or higher, the system draws your Activities edge-to-edge, so the layout that hosts the player must account for the system bars. The SDK has two helpers for it:

```java
import com.appscend.utilities.VeeplayInsets;

setContentView(R.layout.activity_player);
VeeplayInsets.edgeToEdge(getWindow());
VeeplayInsets.applyAsPadding(findViewById(R.id.main_layout));
```

`main_layout` is the root view of your layout. `applyAsPadding()` pads it by the system bar and cutout insets, on top of any padding it already has. If your app targets an older API level, this step is not needed.

## Next steps

- Add [ads](ads.md) to the playlist.
- Let viewers [cast](google-cast.md) to a TV.
- Go through [fullscreen, edge-to-edge and predictive back](fullscreen-and-insets.md).
