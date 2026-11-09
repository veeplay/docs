---
title: Google Cast
sidebar_label: Google Cast
description: Cast video from your Android app to Chromecast devices with the optional Veeplay Cast artifact.
---

import AndroidReleaseNotice from '../../src/components/AndroidReleaseNotice';

Google Cast support is an optional add-on. If your app does not cast, skip this page: the core SDK carries no Cast, MediaRouter or Play Services Cast code.

<AndroidReleaseNotice />

## Set up Cast in three steps

### 1. Add the Cast artifact

```groovy
dependencies {
    implementation 'com.veeplay:veeplay-player-android:{{ANDROID_SDK_VERSION}}'
    implementation 'com.veeplay:veeplay-player-android-cast:{{ANDROID_SDK_VERSION}}'
}
```

The Cast artifact depends on the core SDK and on `androidx.media3:media3-cast`. It also brings in appcompat, MediaRouter, Play Services Cast and Compose Material3 at runtime. Kotlin apps that add it need the Kotlin Gradle plugin 2.1 or higher.

### 2. Declare the options provider in your manifest

Inside `<application>`:

```xml
<meta-data
    android:name="com.google.android.gms.cast.framework.OPTIONS_PROVIDER_CLASS_NAME"
    android:value="androidx.media3.cast.DefaultCastOptionsProvider" />
```

The provider uses the default receiver id `A12D4273`, as the previous version did. If your app still declares the old `com.google.android.exoplayer2.ext.cast` provider (from 3.1.x), replace it. Cast otherwise fails quietly: the log says "Google Cast is not supported on this device", and there is no Cast renderer and no route button. It does not crash.

### 3. Enable Cast in the player

```java
APSMediaPlayer.getInstance().setGoogleCastEnabled();
APSMediaPlayer.getInstance().init(this, false);
```

Cast starts only after `setGoogleCastEnabled()`. You can call it before or after `init()`: it starts Cast at once if the player already has an Activity, and in `init()` otherwise. Repeated calls do nothing until `finish()`.

When Cast is enabled, the content units show a Cast route button in their controls. When a viewer connects to a Cast device, playback moves to it.

Without the Cast artifact, `setGoogleCastEnabled()` only sets a flag, and no route button appears.

## What is cast

| Plays on the Cast receiver | Plays on the phone |
| --- | --- |
| Your content (HLS, DASH, MP4) | Google IMA ads |
| Ads from the native engine, with their tracking | |

IMA ads always play on the device. While casting, your content plays on the receiver and IMA ads play on the phone. If you need ads on the TV, use the native engine (`setPreferGoogleIma(false)`). See [Ads](ads.md).

While an item loads on the receiver, the player can report a `BUFFER_START` and `BUFFER_END` pair to your tracking listeners.

## Cast classes

`com.appscend.media.cast.VeeplayCastManager` and `com.appscend.media.renderers.CastRenderer` keep their names and packages and are part of the Cast artifact.

`VeeplayCastManager.getCastPlayer()` returns an `androidx.media3.cast.CastPlayer`. If your code used the ExoPlayer 2 `CastPlayer` from 3.1.x, update its import. `VeeplayCastManager` also offers `addObserver()` and `removeObserver()` for Cast state changes. The [API reference](api-reference.md) has the details.
