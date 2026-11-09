---
title: Fullscreen, edge-to-edge and predictive back
sidebar_label: Fullscreen and edge-to-edge
description: Fullscreen playback, edge-to-edge layouts and predictive back on Android 15 and 16.
---

Version 3.2 makes fullscreen playback and your player layout work with Android 15 and 16 behavior. Most of it happens automatically. This page lists what to check.

## Fullscreen

Viewers enter fullscreen from the player's fullscreen control, and your code can call `enterFullscreen()` and `exitFullscreen()` on `APSMediaPlayer`.

- The fullscreen dialog and `VeeplayFullscreenActivity` are edge-to-edge and immersive and hide both system bars. They never change your host Activity's window.
- On Android 15 and 16 the first fullscreen shows the system's immersive-mode hint once. This is Android behavior, not the SDK's.
- `setFullscreenOrientationBehaviour()` chooses the orientation in fullscreen: `defaultBehaviour`, `sensorLandscapeOrientation` or `sensorPortraitOrientation`.
- By default the player leaves fullscreen when `finish()` is called. `setLeaveFullscreenOnStop(false)` changes that.
- On Android 11 and higher, `VPUtilities.getWidth()` and `getHeight()` report the window size minus the navigation bar and display cutout insets.

### Rotation while in fullscreen

If the Activity that hosts the player is recreated while the fullscreen dialog is showing (for example by a rotation), the next `exitFullscreen()` can throw `IllegalArgumentException` ("View not attached to window manager"). This has been the case since 3.1.26. A `setFullscreenOrientationBehaviour()` that rotates the screen recreates an Activity that does not handle the rotation itself.

The simple fix is to let your Activity handle the rotation. Declare in your manifest, for the Activity that hosts the player:

```xml
<activity
    android:name=".PlayerActivity"
    android:configChanges="orientation|screenSize" />
```

Add the other configuration changes you expect (for example `screenLayout`, `smallestScreenSize` or `keyboardHidden`). Alternatively, call `exitFullscreen()` before the recreation.

## Edge-to-edge layouts

When your app targets Android 15 (API 35) or higher, Android enforces edge-to-edge for your own Activities, with or without the SDK. The layout that hosts the player then has to handle the system bar insets, and the SDK has helpers in `com.appscend.utilities.VeeplayInsets`:

```java
VeeplayInsets.edgeToEdge(getWindow());
VeeplayInsets.applyAsPadding(findViewById(R.id.main_layout));
```

| Method | Use |
| --- | --- |
| `edgeToEdge(Window)` | Lets the window draw behind the system bars. Pair it with `applyAsPadding()`. |
| `applyAsPadding(View)` | Pads the view by the system bar and cutout insets, on top of its own padding. |
| `applyCutoutAsPadding(View)` | Pads the view by the display cutout insets only. Use it on surfaces that hide the system bars. |
| `hideSystemBars(Window)`, `showSystemBars(Window)` | Hide or show the system bars. |
| `layoutInShortEdges(Window)` | Lets the window extend into the display cutout on the short edges. |

If your app targets an API level below 35, your Activities are not forced edge-to-edge and nothing here is required.

## Predictive back

The SDK's `VeeplayFullscreenActivity` handles BACK through an `OnBackPressedCallback`, so the system back gesture and predictive back work in it. If you override `onBackPressed()` in a subclass and call `super.onBackPressed()`, it still compiles and still reaches `quitActivity()`.

In your own Activity, register an `OnBackPressedCallback` that tears the player down:

```java
getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
    @Override
    public void handleOnBackPressed() {
        APSMediaPlayer.getInstance().finish();
        finish();
    }
});
```

If your app uses `androidx.activity` older than 1.6 and predictive back, call `VeeplayBack.bridge(this)` once in `onCreate()`. It forwards the system back gesture on Android 13 and higher to your `OnBackPressedDispatcher`, which older `androidx.activity` versions never do. With `androidx.activity` 1.6 or higher you do not need it.

```java
import com.appscend.utilities.VeeplayBack;

VeeplayBack.bridge(this); // this: a ComponentActivity
```
