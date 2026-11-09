---
title: Migrating from 3.1 to 3.2
sidebar_label: Migrating 3.1 to 3.2
description: Step-by-step guide for upgrading the Veeplay Android SDK from 3.1.26 to 3.2.
---

import AndroidReleaseNotice from '../../src/components/AndroidReleaseNotice';

This guide takes an app from Veeplay Android SDK 3.1.26 to 3.2.0. Do the steps in order. The full list of changes is in [Changelog](changelog.md).

<AndroidReleaseNotice />

3.2.0 keeps the public API source-compatible, apart from the removals in step 4. For most apps the upgrade comes down to:

1. Update the build settings (step 1).
2. Remove any ExoPlayer 2 dependency, and add the Cast artifact if you use Cast (steps 2 and 3).
3. If your release build is minified, decide whether to keep it unobfuscated with one line in your ProGuard rules (step 6).

Steps 4 and 5 list removed APIs and behaviour changes for reference; most need no action.

## 1. Build requirements

3.2.0 requires:

| Item | Requirement | Reason |
| --- | --- | --- |
| `compileSdk` | 36 or higher | Media3 1.11.1 (its AAR metadata declares `minCompileSdk=36`) |
| Android Gradle Plugin | 8.6.0 or higher | IMA 3.40 depends on `androidx.privacysandbox.ads:ads-adservices`, whose metadata declares `minAndroidGradlePluginVersion=8.6.0` |
| Core library desugaring | enabled | IMA 3.40 and the SDK |
| `minSdk` | 24 or higher | SDK and IMA 3.40 |
| Java | 11 source and target | the SDK is built with 11 |

AGP 8.6 itself needs a recent Gradle (8.7 or higher) and JDK 17 to run Gradle. If your AGP prints a warning that `compileSdk` 36 is newer than it was tested with, use a newer AGP rather than lowering `compileSdk`.

Example:

```groovy
android {
    compileSdk 36
    defaultConfig {
        minSdk 24
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_11
        targetCompatibility JavaVersion.VERSION_11
        coreLibraryDesugaringEnabled true
    }
}

dependencies {
    implementation 'com.veeplay:veeplay-player-android:{{ANDROID_SDK_VERSION}}'
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.1.5'
}
```

Use `desugar_jdk_libs` 2.1.5 or higher. The SDK does not ship it; this is the app's decision.

If your app targets Android 15 (API 35) or higher, the system enforces edge-to-edge for your own Activities. See "Insets" in step 5.

Remove this line from the product flavors of your app, if you have it. The SDK has no flavors any more:

```groovy
missingDimensionStrategy 'veeplaySDK', 'general'
```

## 2. Dependency changes

### Media3 replaces ExoPlayer v1 and ExoPlayer 2

- 3.1.26 bundled ExoPlayer v1 and depended on ExoPlayer 2.14. 3.2.0 uses Media3 1.11.1 (`media3-exoplayer`, `-hls`, `-dash`, `-smoothstreaming`, `-ui`). Media3 is a runtime dependency of the SDK.
- If your own code used ExoPlayer 2 classes that came in through the SDK, declare the dependency you need yourself. If your code uses Media3, declare Media3 1.11.1 yourself too, because the SDK does not export Media3 to your compile classpath.
- If another library in your app declares an older Media3 (for example Prebid 3.3.4 declares 1.3.1), Gradle raises it to 1.11.1 at runtime. Your own code still compiles against what you declared. Declare 1.11.1 to avoid surprises.
- There is one set of `exo_*` resources now: the one from `media3-ui`. Remove `com.google.android.exoplayer:exoplayer-ui` (and any other ExoPlayer 2 artifact) from your app, or the resources and styleables clash. Layouts that inflate `com.google.android.exoplayer2.ui.PlayerView` must use `androidx.media3.ui.PlayerView`.
- The SDK ships 29 resource names without a `veeplay_` prefix (`back`, `forward`, `play`, `pause`, `loading0` to `loading7`, `webbrowser`, `share`, `isTablet` and others). None of them collides with Media3. If your app defines a resource with one of these names, yours wins.

### OkHttp 4

OkHttp is 4.12.0 (it was 3.x), with Okio 3. It is an `api` dependency because `APSMediaPlayer.getHttpClient()` returns an `OkHttpClient`. If your app uses OkHttp 3 APIs that changed in 4, or pins OkHttp 3 or Okio 1/2, move it to 4.12.0 or higher.

### jdom2

`org.jdom:jdom2:2.0.6.1` comes from Maven. The jar bundled in 3.1.26 is gone. VAST and VMAP parsing no longer expands entities or loads external DTDs (XXE fix). DOCTYPE declarations still parse. Nothing to do unless your app also bundles a jdom jar.

### Gson

Gson is 2.13.2. Keep your app on Gson 2.13.x. Gson 2.15 builds nested JSON objects as `LinkedHashMap`, which breaks the SDK's `LinkedTreeMap` signatures (`APSVastAdBreak`, `APSMediaBuilder`), and Gson 2.14 rejects a duplicate key after a null that older versions accepted. If your build forces a newer Gson, JSON configuration will fail.

### Other dependencies

- IMA SDK is 3.40.0 (was 3.27.0). It is an implementation dependency. It adds these permissions to your merged manifest: `AD_ID`, `ACCESS_ADSERVICES_ATTRIBUTION`, `ACCESS_ADSERVICES_AD_ID` and `AD_SERVICES_CONFIG`. Apps that use the Google Mobile Ads or Next-Gen Ads SDK already declare `AD_ID`. If you'd rather not declare them, remove them with `tools:node="remove"` and check the Play Console advertising ID declaration.
- `androidx.core` 1.8.0 or higher and `androidx.annotation` 1.8.1 or higher resolve now. `androidx.collection` 1.1.0 is an `api` dependency.
- `legacy-support-v4` is no longer a dependency. The SDK uses `core`, `fragment`, `activity`, `collection`, `annotation` and `localbroadcastmanager`. If your app used support classes that arrived through the SDK, declare the AndroidX artifact you need.
- The `org.apache.http.legacy` library is no longer used by the SDK.
- The SDK publishes as one release variant. The POM has no `com.veeso` coordinates and no `com.google.android.exoplayer` coordinates.

## 3. Optional Cast artifact

Google Cast moved out of the core SDK. Without the Cast artifact the SDK has no Cast, MediaRouter or Play Services Cast code, and `setGoogleCastEnabled()` only sets a flag.

If your app uses Cast:

1. Add the artifact. It depends on the core SDK and on `androidx.media3:media3-cast:1.11.1`.

   ```groovy
   dependencies {
       implementation 'com.veeplay:veeplay-player-android:{{ANDROID_SDK_VERSION}}'
       implementation 'com.veeplay:veeplay-player-android-cast:{{ANDROID_SDK_VERSION}}'
   }
   ```

   Cast adds appcompat, MediaRouter, Play Services Cast and Compose Material3 at runtime. `media3-cast` 1.11.1 brings the Kotlin 2.2 standard library at compile scope, so Kotlin apps that add the Cast artifact need the Kotlin Gradle plugin 2.1 or higher. The core artifact adds no Kotlin requirement.

2. Call `setGoogleCastEnabled()`. Cast does not start without it. In 3.1.26, `init()` always started the Cast context and `getInstance()` always registered the Cast renderer, so Cast could switch in automatically. In 3.2.0 the automatic switch to Cast only works after `setGoogleCastEnabled()`:

   ```java
   APSMediaPlayer.getInstance().setGoogleCastEnabled();
   APSMediaPlayer.getInstance().init(this, false);
   ```

   You can call it before or after `init()`. It starts Cast at once if the player has an Activity, and in `init()` otherwise. Repeated calls do nothing until `finish()`.

3. Replace the Cast options provider in your manifest. The `com.google.android.exoplayer2.ext.cast` class no longer exists. Both providers use receiver id `A12D4273`.

   ```xml
   <meta-data
       android:name="com.google.android.gms.cast.framework.OPTIONS_PROVIDER_CLASS_NAME"
       android:value="androidx.media3.cast.DefaultCastOptionsProvider" />
   ```

   If the old value stays, Cast fails silently: the log says "Google Cast is not supported on this device", and there is no Cast renderer and no route button. There is no crash.

4. `VeeplayCastManager.getCastPlayer()` returns `androidx.media3.cast.CastPlayer` (a final `ForwardingPlayer`). It returned `com.google.android.exoplayer2.ext.cast.CastPlayer`. Update the import and any code that used ExoPlayer 2 `Player` types with it. `VeeplayCastManager` implements `androidx.media3.cast.SessionAvailabilityListener` and `androidx.media3.common.Player.Listener`; `onPlayerStateChanged(boolean, int)` is kept. `VeeplayCastManager.VeeplayCastManagerStateListener` now extends `com.appscend.media.cast.CastStateObserver`; its method is unchanged. New: `addObserver` and `removeObserver` on `VeeplayCastManager`.

The classes `com.appscend.media.cast.VeeplayCastManager` and `com.appscend.media.renderers.CastRenderer` keep their names and packages. They are in the Cast artifact now.

If you override the string `rendering_cast_text` in your app, it still works.

## 4. Removed and deprecated API

### Removed

| Removed | Use instead |
| --- | --- |
| ExoPlayer v1 renderer and its classes in `com.appscend.media.renderers.exoPlayerRenderers`: `DemoUtil`, `ExoPlayerInterface` (and nested types), `DashRendererBuilder`, `HlsRendererBuilder`, `SmoothStreamingRendererBuilder`, `ExtractorRendererBuilder`, `SrtTrackRendererBuilder`, `EventLogger`, `HttpSampleSource`, `HttpSampleSourceReader`, `WidevineTestMediaDrmCallback`, `SmoothStreamingTestMediaDrmCallback` | `Media3Renderer` (`com.appscend.media.renderers`, id `media3-renderer`) |
| `ExoPlayerRenderer.getExoPlayerInstance()` | `Media3Renderer` has no public player accessor. Use the `APSMediaPlayer` API. |
| `PlayerView.acquireVideoTexture(Context, ExoPlayerInterface)` | none; `PlayerView` is a deprecated stub |
| MRAID and Madvertise (`com.appscend.mraid.*`, `APSMediaPlayerMRAIDOverlayController`, `APSMRAIDExtension`) | none |
| YouTube units, `APSMediaPlayerYoutubeOverlayController`, `YouTubePlayerFragmentX` | none. A JSON unit with a `youtube` key logs an error, emits an `ERROR` event with the description `youtube unsupported` and is skipped. |
| `exoplayer-renderer` and `exoplayer2-renderer` as renderer ids | `media3-renderer`. The JSON `renderer` key and `setCurrentRenderer()` map the old ids to it for you. |
| Persistent cookie store | none (it had not worked since 2019) |

### Deprecated

| Deprecated | Replacement |
| --- | --- |
| `APSMediaPlayer.setPreferExoPlayer2(boolean)` | Not needed. It only raises the Media3 renderer's priority over the MediaPlayer renderer (100 against 2). `isPreferExoPlayer2()` is unchanged. To force the MediaPlayer renderer, use `setPreferMediaPlayerRenderer(true)`. |
| `ExoPlayerRenderer`, `ExoPlayer2Renderer` | `Media3Renderer`. Both stay as empty abstract classes that keep `rendererIdentifier`; they are not registered, so `player() instanceof ExoPlayer2Renderer` is always `false`. |
| `IVeeplayRenderer.switchSurface(PlayerView)` | none. It is a default no-op method, so your renderers still compile. |
| `PlayerView` in `exoPlayerRenderers` | Use `androidx.media3.ui.PlayerView` for your own views. |
| `APSMediaPlayer.setYouTubeApiKey(String)`, `getYoutubeApiKey()` | none. Both are no-ops. |

### Added

- `APSMediaBuilder.configureFromURL(URL, ConfigureCallback)` loads the JSON on a background thread and calls `onConfigured(boolean ok)` on the main thread. `configureFromURL(URL)` still works and blocks the calling thread. Prefer the new one.

  `mediaUnits()` can block on the network: with `ads.vmap` in the configuration it fetches the VMAP, and `mediaUnits(true)` also loads the preroll ads. With either, do not call it on the main thread. Build the playlist on a background executor and post `playMediaUnits()` to main:

  ```java
  private final ExecutorService buildExecutor = Executors.newSingleThreadExecutor();
  private final Handler main = new Handler(Looper.getMainLooper());

  // in onCreate():
  builder.configureFromURL(url, ok -> {
      if (!ok) return;
      buildExecutor.execute(() -> {
          ArrayList<APSMediaEvent> units = builder.mediaUnits();
          main.post(() -> {
              if (!isFinishing() && !isDestroyed() && APSMediaPlayer.isInitialized())
                  APSMediaPlayer.getInstance().playMediaUnits(units);
          });
      });
  });
  ```

  The check before `playMediaUnits()` drops a result that arrives after the user has left the Activity.

- `APSMediaPlayer.isActivityPaused()`.
- `APSMediaPlayer.setSessionCookiesEnabled(boolean)` and `isSessionCookiesEnabled()` (see "Cookies" in step 5).
- `VeeplayInsets` and `VeeplayBack` (see step 5).
- Manifest: the SDK declares `com.appscend.utilities.WebBrowser` with `exported="false"`. Delete your own declaration. If you keep one with different `configChanges` or `windowSoftInputMode`, the manifest merger reports a conflict; add `tools:replace` or delete yours.

## 5. Behaviour changes an app may notice

### Ads, like content, are hidden from screenshots by default

IMA ads render into a `SurfaceView` that follows `setSecureSurfaceView()`, as content does. The default is `true`, so ads (and content) appear black in screenshots, screen recordings and MediaProjection captures on the device. If your app needs capture, call this before `init()`:

```java
APSMediaPlayer.getInstance().setSecureSurfaceView(false);
```

This changes content as well.

### Activity recreation

On `init()` with a new Activity, the SDK moves its views to the new Activity only when the previous Activity reports `isDestroyed()`. That covers system recreation, configuration changes and `recreate()`. `viewController()` then returns a new container on the new Activity, with all children moved (renderer view, IMA ad container, overlays, controls). Layout params carry over; other properties you set on the old container do not.

The SDK's own controls overlay is rebuilt on the new Activity. Host overlay controllers (your `APSMediaPlayerOverlayController` subclasses) are moved as they are, so their views must not hold on to the old Activity. If they do, rebuild them in `load(Context)`.

A host that starts a second Activity and finishes the first one later keeps the 3.1.26 behaviour: only the Activity reference changes and the views stay where you put them. `VeeplayFullscreenActivity` works this way.

The SDK container views, the Media3 `PlayerView` and the playback controls let the old Activity go. These still hold it until they end or until `finish()`:

- the `MediaPlayerRenderer` and `CastRenderer` views;
- an IMA break prepared or playing during the recreation (its ad container, `AdsLoader` and ad player);
- other overlays on screen;
- the SDK fullscreen dialog (see Known limitations).

Recommended pattern: after recreation, if a playlist is still processing, re-attach instead of replaying it.

```java
boolean recreated = savedInstanceState != null
        && APSMediaPlayer.isInitialized()
        && APSMediaPlayer.getInstance().isProcessing();

APSMediaPlayer.getInstance().init(this, false);
View views = APSMediaPlayer.getInstance().viewController();
if (views.getParent() != null) ((ViewGroup) views.getParent()).removeView(views);
container.addView(views);

if (!recreated) {
    buildAndPlay(); // mediaUnits() off the main thread, see section 4
}
```

`isProcessing()` is now also `true` while a preroll, postroll or VMAP pre/post break loads or plays, so a recreation during a preroll no longer replays it. Also remove your tracking listener in `onDestroy()`.

### Pause and resume

Call `APSMediaPlayer.onActivityPaused()` and `onActivityResumed()` from your Activity. Nothing starts while the Activity is paused; a unit that was due to start begins on `onActivityResumed()`. Resume restarts only a unit that was playing before the pause. If you call `resumePlay()` or `play()` between `onActivityPaused()` and `onActivityResumed()`, the call is deferred and `playbackState()` and `isPaused()` keep their values until resume. Calling `resumePlay()` in your `onResume()` before `onActivityResumed()` is safe.

### Live streams

Live items report duration 0, so the LIVE UI and the live timers work. `seekTo()` on a live item does nothing.

### Ad requests happen earlier

- The next playlist-level break is requested about `preloadInterval` (10 s) before the current unit ends. Listeners see `ADBREAK_LOAD`, `AD_REQUESTED` and `AD_REQUEST_COMPLETE` before the content's `COMPLETE`.
- IMA breaks are prepared before the cue: the ad request and its VAST response are ready at the cue, at most one break ahead. Ad servers see tag requests earlier. A break dropped by a seek or by leaving inside that window costs a request that never plays (no impression). `ADBREAK_TRIGGERED` still fires at the cue.
- Same-offset VMAP breaks (pods) play one after another, with content paused between them.

### IMA details

- `skip()` and `next()` during an IMA preroll or postroll end that break and continue the playlist once.
- During a non-linear IMA ad, `currentPlaybackTime()`, `duration()`, `pause()` and `resumePlay()` act on the content. `isPlayingImaAd()` is unchanged.
- The screen is held on while an IMA preroll, midroll or postroll shows.
- A process-wide thread named `VeeplayAdPlayback` runs from the first IMA ad onwards.
- `APSImaAdBreak.init()` and `trigger()` are idempotent.

### Cookies

VAST and tracking requests use a session-only in-memory cookie jar. License and usage requests stay cookie-less. In 3.1.26 the persistent store did not work, so no cookies were sent. If your ad servers rely on session cookies, they are sent now. To keep 3.1.26's behaviour and send none, call this before `init()`:

```java
APSMediaPlayer.setSessionCookiesEnabled(false);
```

It covers the SDK's own configuration, VAST, wrapper, tracking and SSAI requests. Media requests are unchanged, and with the IMA engine, IMA makes its ad and tracking requests itself, as in 3.1.26. The SDK installs a process-wide `CookieHandler` only when your app has not set one; 3.1.26 replaced yours.

### Playlist and timing details

- In a playlist with several content units, each content unit after the first gets its own copy of every midroll and non-linear break. Changing a break after `mediaUnits()` only affects the first content unit's break.
- `addOverlays()` converts `%` start and end points against the duration in seconds. Overlays added before the duration is known are converted once it is; `+N` ends become start + N. Overlays added while no unit is current are kept for the next unit.
- `currentUnit()` also includes events that are preloaded but not yet triggered.
- The playlist mutators hold the monitor of the list `getPlaylist()` returns. `getPlaylist()` still returns the live list. Synchronize on it if you iterate it while the player runs.
- `AsyncWorker.stop()` quits its thread safely. `finish()` also quits the player's public `handlerThread`.
- A failed unit's fallback plays next, also after replayable units.
- In ad units' URLs, `[CONTENTPLAYHEAD]` is the break's content offset. A postroll ad's `[MEDIAPLAYHEAD]` is the last content duration. Playlist-level breaks expand unit macros outside a unit (`-1`, and `0` for the playheads) in their ad requests.
- The next playlist-level break (the next item's preroll, or a postroll) now loads about `preloadInterval` before the content ends, while the content still plays. Error pixels sent during that load (VAST codes 204, 205, 302, 303 and 403, and the break's 1003) expand against the playing content unit: `[CONTENTPLAYHEAD]` and `[ADPLAYHEAD]` carry the content position, and the unit macros come from the content unit. In 3.1.26 both playheads were 0.
- One content player serves a whole playlist, so `PlayerView.getPlayer()` stays the same across items. A new player is built after a playback error, a renderer switch (Cast) and `finish()` and `init()`. After a recreation, `getView()` returns a new `PlayerView` on the new Activity showing the same player. Item transitions after a natural end or an error happen one main-loop step later; a command that arrives in that window acts on the ending item.
- After `finish()`, VAST preloads and overlay work that are still running stop. Playlists you build while the previous player is finishing keep their prerolls.

### License host and invalid license

License and usage requests go to `panel.veeplay.com:5201` (3.1.26: `panel.veeso.co:5201`). If your app restricts network destinations through a network security config, a firewall or a proxy allowlist, allow the new host.

The license check and usage tracker run on their own executor, so playback never waits for them, and an unreachable server does not stop playback. With an invalid license, the 404 can arrive after a preroll has started.

### Fullscreen and insets

- `VeeplayFullscreenActivity` and the fullscreen dialog (`enterFullscreen()` and `exitFullscreen()`) are edge-to-edge and immersive and hide both system bars. The host Activity's window is never changed. The first fullscreen on Android 15 and 16 shows the system's immersive-mode hint once; this is Android behaviour.
- BACK in `VeeplayFullscreenActivity` goes through `OnBackPressedCallback`. Subclasses that call `super.onBackPressed()` still compile and still reach `quitActivity()`.
- On Android 11 and higher, `VPUtilities.getWidth()` and `getHeight()` use the window metrics minus navigation-bar and cutout insets.
- When your app targets 35 or higher, Android enforces edge-to-edge for your Activities, so the layout that hosts the player must handle insets:

  ```java
  VeeplayInsets.edgeToEdge(getWindow());
  VeeplayInsets.applyAsPadding(findViewById(R.id.main_layout));
  ```

  Use `applyCutoutAsPadding(view)` on surfaces that hide the system bars. For predictive back with `androidx.activity` older than 1.6, call `VeeplayBack.bridge(this)` in `onCreate()`.

### Cast tracking

While an item loads on the receiver, `CastRenderer` can send a `BUFFER_START` and `BUFFER_END` pair to tracking listeners. ExoPlayer 2 did not send them.

### Known limitations

- The IMA engine does not render non-linear (overlay) ads. IMA reports `VAST_TRAFFICKING_ERROR` 200 ("nonlinear is not supported"), as in 3.1.26. Use the native engine (`setPreferGoogleIma(false)`) for them.
- Activity recreation during SDK fullscreen (present since 3.1.26). If the Activity is recreated while the fullscreen dialog from `enterFullscreen()` is shown, the player keeps the fullscreen state, the dialog and the inline parent of the destroyed Activity. The next `exitFullscreen()`, including the one at the end of the playlist or in `finish()` with `setLeaveFullscreenOnStop(true)` (the default), moves the player view into the destroyed Activity's layout and dismisses a detached dialog. That can throw `IllegalArgumentException` ("View not attached to window manager"). A `setFullscreenOrientationBehaviour()` that rotates the screen causes such a recreation when the Activity does not handle the rotation itself. Workaround: declare `android:configChanges="orientation|screenSize"` (and the other changes you expect) on the Activity that hosts the player, or call `exitFullscreen()` before a recreation.
- An IMA break starts its ads only while playback is not paused. If its ads finish loading while the user has paused (or the app is in the background), IMA's own error report for an ad it cannot play is sent when playback resumes, and not at all if the user leaves the player first. In 3.1.26 the error was reported as soon as the ads loaded.

## 6. R8 and consumer rules

This step only matters if your release build is minified (`minifyEnabled true`).

**To keep your release build as it is, add one line to your own ProGuard rules:**

```
-dontobfuscate
```

3.1.26's consumer rules contained `-dontobfuscate`, which switched off obfuscation for your whole app, not only for Veeplay. Recent AGP 9 versions already ignore such app-wide options in library rules. 3.2.0's rules cover only Veeplay's own classes, so without the line above, a minified build would start renaming your own classes too.

Your current release `mapping.txt` shows which case you are in. If your own classes are already renamed there (for example `com.example.Foo -> a.b:`), your build is obfuscated today, nothing changes for you, and you don't need the line.

Obfuscation is worth having (a smaller app that is harder to reverse-engineer), and you can switch it on whenever it suits you: remove the line, add keeps for your own reflection (for example Gson models and JavaScript interfaces), and check that your crash reports are deobfuscated. Google Play does this for App Bundles, and the Crashlytics Gradle plugin uploads the mapping file by default.

For reference, the AAR's `proguard.txt` changed:

- It no longer applies app-wide options (`-dontobfuscate`, `-optimizationpasses`, `-dontpreverify`, `-dontusemixedcaseclassnames`, `-optimizations`).
- It no longer keeps every public and protected `com.appscend` member, the IMA classes or the `com.google.obf` classes. IMA ships its own rules.
- It ships member-level keeps only.

What stays kept for your app, including your own subclasses and implementations:

- `<init>()` and `type()` of `KRAdapter` and `UnitManager` implementations;
- the static `getPriorityIndex()` of `IVeeplayRenderer` implementations;
- the public methods of `APSMediaPlayerOverlayController` subclasses and `APSFrameworkExtension` implementations;
- `com.appscend.vast.APSVAST*Node` classes with `<init>()` and `initWithNode(APSVASTXMLNode)`;
- the `CREATOR` field of `com.appscend.**` `Parcelable` classes;
- in the Cast artifact: `VeeplayCastExtensionImpl` and its `<init>()`.

What to do:

- Remove `android.r8.globalOptionsInConsumerRules.disallowed=false` from your `gradle.properties`. It is not needed any more.
- If your app uses reflection on SDK classes, add keeps for exactly those classes and members to your own rules. The SDK no longer keeps them for you.
- If your own rules existed only to work around the SDK's global options, you can drop them.
- If something behaves differently only in a minified build, send us the R8 `mapping.txt` and we'll help.
