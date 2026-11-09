---
title: Changelog
sidebar_label: Changelog
description: What changed in each release of the Veeplay Android SDK.
---

## 3.2.0-rc1

Release candidate for 3.2.0. 3.2.0 replaces the ExoPlayer engines with Media3, moves to IMA SDK 3.40, splits Google Cast into an optional artifact and adds Android 15 and 16 support. It also fixes a large set of playback, VAST and IMA bugs.

**Upgrading from 3.1.26.** The public API stays source-compatible, and for most apps the upgrade is a set of build-file changes: compileSdk 36, Android Gradle Plugin 8.6, core library desugaring and minSdk 24 (see Requirements). One release-build detail: 3.1.26's ProGuard rules switched off obfuscation for the whole app, and 3.2.0's rules cover only Veeplay's own classes. To keep a minified release build exactly as it is, add `-dontobfuscate` to your own rules. [migration guide](migration-3-2.md) walks through each step.

### Requirements

Apps that use 3.2.0 need:

- `compileSdk` 36 or higher (the Media3 1.11.1 AAR metadata declares `minCompileSdk=36`).
- Android Gradle Plugin 8.6.0 or higher (IMA 3.40 depends on `androidx.privacysandbox.ads:ads-adservices`, whose metadata declares `minAndroidGradlePluginVersion=8.6.0`). AGP 8.6 needs Gradle 8.7 or higher and JDK 17.
- Core library desugaring enabled (`coreLibraryDesugaringEnabled = true` and a `desugar_jdk_libs` dependency).
- `minSdk` 24 (it was lower before).
- Java 11 source and target compatibility.

The optional Cast artifact has the same requirements. Kotlin apps that add it need the Kotlin Gradle plugin 2.1 or higher, because `media3-cast` 1.11.1 brings the Kotlin 2.2 standard library at compile scope. The core artifact adds no Kotlin requirement.

### Added

- Media3 1.11.1 playback (ExoPlayer, HLS, DASH, SmoothStreaming, UI) through a new renderer, `Media3Renderer` (id `media3-renderer`). One renderer replaces the ExoPlayer v1 and ExoPlayer 2 renderers.
- Optional Google Cast artifact `com.veeplay:veeplay-player-android-cast`. Without it, the SDK carries no Cast, MediaRouter or Play Services Cast code.
- `APSMediaBuilder.configureFromURL(URL, ConfigureCallback)`: loads the JSON configuration on a background thread and calls back on the main thread. The synchronous `configureFromURL(URL)` still works but blocks the calling thread. The callback runs on main, but `mediaUnits()` fetches the VMAP (`ads.vmap`) and, with `mediaUnits(true)`, the preroll ads synchronously: with either, call `mediaUnits()` on a background thread and post `playMediaUnits()` to main (see the migration guide).
- `APSMediaPlayer.isActivityPaused()`.
- `APSMediaPlayer.setSessionCookiesEnabled(boolean)` and `isSessionCookiesEnabled()`: the session cookie jar for configuration, VAST, tracking and SSAI requests is on by default; switch it off to send no cookies on those requests.
- `com.appscend.utilities.VeeplayInsets`: helpers for edge-to-edge layouts (`edgeToEdge`, `applyAsPadding`, `applyCutoutAsPadding`, `hideSystemBars`, `showSystemBars`, `layoutInShortEdges`).
- `com.appscend.utilities.VeeplayBack.bridge(ComponentActivity)`: forwards the system BACK gesture on Android 13+ to your `OnBackPressedDispatcher`, for apps that use predictive back with `androidx.activity` older than 1.6.
- `com.appscend.media.CastSupport`, `CastStateObserver`, `VeeplayCastState` and `VeeplayCastExtension`: the core-side Cast interface.
- Android 15 and 16 support: edge-to-edge and immersive fullscreen, predictive back, cutout handling.
- IMA ads are prepared before their cue. The ad request and its VAST response are ready when the break starts, so breaks start sooner.
- The SDK manifest declares `com.appscend.utilities.WebBrowser` (not exported). You can drop your own declaration.

### Changed

Behaviour changes your app may notice:

- **Video decoding.** The content and IMA ad players never use Media3's detached-surface decoding mode, on any API level. On Android 15 and later, that mode shows a single black frame at regular intervals in release (non-debuggable) builds (androidx/media#2059). 3.1.26 was not affected; the workaround keeps the Media3 engine free of it.
- **Secure ad surface.** IMA ads render into a `SurfaceView` that follows `APSMediaPlayer.setSecureSurfaceView()`, which defaults to `true`, as content does. With the default, ads appear black in screenshots and screen recordings. Call `setSecureSurfaceView(false)` before `init()` if your app needs capture. This also affects content.
- **Cast starts only when you ask.** `init()` no longer starts the Cast context. Cast starts after `setGoogleCastEnabled()`. Without the Cast artifact, `setGoogleCastEnabled()` only sets a flag and shows no route button.
- **`getCastPlayer()` returns `androidx.media3.cast.CastPlayer`.** It used to return the ExoPlayer 2 `CastPlayer`.
- **Live streams report duration 0.** The LIVE UI and the live timer now work for live content. `seekTo` on a live item does nothing.
- **Activity pause and resume.** Nothing starts while the host Activity is paused; the unit starts on `onActivityResumed()`. Resume restarts only a unit that was playing before the pause. A `resumePlay()` or `play()` call made while the Activity is paused is deferred until `onActivityResumed()`.
- **Activity recreation.** On `init()` with a new Activity, the SDK moves its views to the new Activity only when the previous Activity reports `isDestroyed()` (system recreation, configuration change, `recreate()`). The SDK's own controls overlay is rebuilt on the new Activity. Host overlay controllers are moved as they are: their views must not hold on to the old Activity, so rebuild them in `load(Context)` if they do. Call `viewController()` again after `init()` and re-attach it. A host that starts a new Activity and finishes the old one later keeps the 3.1.26 behaviour. If a playlist is still processing when the Activity is recreated, re-attach instead of building and playing the playlist again.
- **`isProcessing()`** is also `true` while a playlist-level break (preroll, postroll, VMAP pre/post break) loads or plays. `playMediaUnits()` and `playAlreadySetMediaUnits()` during such a break only append to the queue.
- **One content player per playlist.** The `PlayerView` returned by the renderer keeps the same `Player` across the items of a playlist. Items start sooner, because no player is released and rebuilt between them. The player is built from the application context, not the Activity. As with 3.1.26's default renderer, the player area is black between items and after the last one, until the next video's first frame. The ExoPlayer 2 renderer kept the last frame after the last item.
- **Breaks load earlier.** The next playlist-level break (preroll, postroll, VMAP) is requested about `preloadInterval` (10 s) before the current unit ends, not after. Listeners see `ADBREAK_LOAD`, `AD_REQUESTED` and `AD_REQUEST_COMPLETE` before the content's `COMPLETE`. Ad servers see tag requests earlier.
- **IMA breaks.**
  - Same-offset VMAP breaks (pods) play one after another, with content paused between them. Each break emits its own `ADBREAK_TRIGGERED` when it actually starts.
  - During a non-linear IMA ad, `currentPlaybackTime()` and `duration()` report the content, and `pause()` and `resumePlay()` pause and resume the content.
  - `skip()` and `next()` during an IMA preroll or postroll end that break and continue the playlist once.
  - `seekTo(ms)` during an IMA midroll uses the content position and duration.
  - Inside a pod, an error on an ad that is not the last no longer ends the break at once.
  - The screen is held on while an IMA preroll, midroll or postroll shows.
  - A process-wide thread named `VeeplayAdPlayback` starts with the first IMA ad and stays for the life of the process.
  - `APSImaAdBreak.init()` and `trigger()` can be called more than once.
- **Overlays.** `addOverlays()` converts `%` start and end points against the content duration in seconds. Overlays added before the duration is known are converted once it is. `+N` end points become start + N. Host overlays now join the unit they are added to.
- **Per-content copies of breaks.** In a playlist with several content units, each content unit after the first gets its own copy of each midroll and non-linear break. Changing a break after `mediaUnits()` affects only the first content unit's break.
- **Macros.** In an ad unit's URLs, `[CONTENTPLAYHEAD]` is the break's content offset, not the ad's playhead. A postroll ad's `[MEDIAPLAYHEAD]` is the last content duration, not 0. Ad requests of playlist-level breaks expand unit-derived macros outside any unit (`-1`, and `0` for the playheads). The error pixels of a playlist-level break preloaded ahead of its cue (VAST codes 204, 205, 302, 303 and 403, and the break's 1003) are sent while the content still plays, so they expand against the content unit: `[CONTENTPLAYHEAD]` and `[ADPLAYHEAD]` carry the content position and the unit macros come from the content unit. In 3.1.26 the break loaded after the content ended and both playheads were 0.
- **Failed unit fallback.** A failed unit's fallback now plays next, also after replayable units.
- **Cookies.** VAST and tracking requests use a session-only, in-memory cookie jar. In 3.1.26 the persistent cookie store had been broken since an OkHttp upgrade in 2019, so no cookies were sent. License and usage requests stay cookie-less. To keep 3.1.26's behaviour, call `APSMediaPlayer.setSessionCookiesEnabled(false)` before `init()`. The process-wide `CookieHandler` is installed only when your app has not set one; 3.1.26 replaced it.
- **TLS.** VAST, tracking and SSAI requests offer TLS 1.0 to 1.3 and cleartext, as in 3.1.26, on OkHttp 4.
- **License host.** License and usage requests go to `panel.veeplay.com:5201` instead of `panel.veeso.co:5201`. If your app restricts network destinations (network security config, firewall or proxy allowlists), allow the new host. As before, playback never waits for these requests, and an unreachable server does not stop playback.
- **Invalid license.** The license check and the usage tracker run on their own executor. With an invalid license the 404 can arrive after a preroll has started.
- **Fullscreen.** `VeeplayFullscreenActivity` and the fullscreen dialog are edge-to-edge and immersive and hide both system bars. The dialog never changes the host Activity's window. The first fullscreen on Android 15 and 16 shows the system's immersive-mode hint once; this is Android behaviour. BACK in `VeeplayFullscreenActivity` goes through an `OnBackPressedCallback`.
- **Window metrics.** On Android 11 and higher, `VPUtilities.getWidth()` and `getHeight()` use the current window metrics minus navigation-bar and cutout insets.
- **Targeting 35 or higher.** Android enforces edge-to-edge for your own Activity. The player host layout must handle insets (see the migration guide).
- **Merged manifest.** IMA 3.40 adds the `AD_ID`, `ACCESS_ADSERVICES_ATTRIBUTION`, `ACCESS_ADSERVICES_AD_ID` and `AD_SERVICES_CONFIG` permissions.
- **After `finish()`.** VAST preloads, overlay updates and other overlay work that outlive `finish()` stop instead of recreating an uninitialised player. Late ad requests, wrapper follow-ups, their tracking and queued triggers no longer run. Playlists you build while the previous player is finishing keep their prerolls. `VASTMacroHandler.processUrl()` no longer creates a player: with none live, it leaves the client-info macros and `[PLAYERSIZE]` unexpanded. `APSMediaBuilder` fetches made before a player exists use a separate session client, so cookies set by those responses are not sent with the player's later ad and tracking requests.
- **Overlay removal.** An overlay's view is removed, and its `FINISH` event and tracking are sent, when its fade-out ends. If the fade-out is not drawn (for example while the app is in the background), this happens at most 0.5 s after the configured fade duration has elapsed. Before, they waited for the animation to finish drawing.
- **Cast tracking.** While an item loads on the receiver, `CastRenderer` can send a `BUFFER_START` and `BUFFER_END` pair that ExoPlayer 2 did not send.
- **Unit start gating.** A unit with `autoplay: false` stays paused until `play()` and is not auto-paused when the player is not visible.
- **Resources.** `rendering_cast_text` moved to the Cast artifact. Overriding it by name still works.
- **Build.** The SDK has no product flavors; drop `missingDimensionStrategy 'veeplaySDK', 'general'`. The consumer ProGuard/R8 rules changed (see Removed and the migration guide).

### Deprecated

- `APSMediaPlayer.setPreferExoPlayer2(boolean)`: only raises the Media3 renderer's priority above the MediaPlayer renderer. `isPreferExoPlayer2()` is unchanged.
- `ExoPlayerRenderer` and `ExoPlayer2Renderer`: empty holders that keep `rendererIdentifier` and keep `player() instanceof ExoPlayer2Renderer` compiling (always `false`). Use `Media3Renderer`.
- `IVeeplayRenderer.switchSurface(PlayerView)`: now a default no-op method.
- `com.appscend.media.renderers.exoPlayerRenderers.PlayerView`: still present, with no-op surface methods.
- `APSMediaPlayer.setYouTubeApiKey(String)` and `getYoutubeApiKey()`: no-ops. `getYoutubeApiKey()` returns the stored value.

### Removed

- ExoPlayer v1 and ExoPlayer 2.14, including everything in the `exoPlayerRenderers` package except `PlayerView`: `DemoUtil`, `ExoPlayerInterface` and its nested types, the `*RendererBuilder` classes, `EventLogger`, `HttpSampleSource`, `HttpSampleSourceReader` and the Widevine and SmoothStreaming test callbacks. Also removed: `ExoPlayerRenderer.getExoPlayerInstance()` and `PlayerView.acquireVideoTexture(Context, ExoPlayerInterface)`.
- The renderer ids `exoplayer-renderer` and `exoplayer2-renderer` as selectable renderers. They map to `media3-renderer` in `setCurrentRenderer` and in the JSON `renderer` key. The default renderer id of a media unit is `media3-renderer`.
- YouTube units. A JSON unit with a `youtube` key logs an error, emits an `ERROR` event with the description `youtube unsupported` and is skipped. The YouTube overlay controller and the YouTube API jar are gone.
- MRAID and Madvertise (`com.appscend.mraid.*`, the MRAID overlay controller and extension).
- The bundled jdom jar (now `org.jdom:jdom2` from Maven), `legacy-support-v4`, the Apache HTTP legacy library and the unused jars.
- The persistent cookie store.
- App-wide options in the SDK's consumer ProGuard/R8 rules (`-dontobfuscate`, `-optimizationpasses` and others), the blanket keep of every public and protected `com.appscend` member, and the keeps for IMA and `com.google.obf` classes. The rules now keep only what the SDK needs, and IMA ships its own. A minified app that wants to stay unobfuscated adds `-dontobfuscate` to its own rules (see the migration guide). The `android.r8.globalOptionsInConsumerRules.disallowed=false` opt-out is no longer needed.

### Fixed

Playback and lifecycle

- A unit with `autoplay: false` started anyway. It now waits for `play()`.
- The screen stayed on after the playlist ended.
- A unit started while the host Activity was paused could start in the background or stall at 0. Nothing starts until the Activity resumes.
- After a pause, resume restarted a unit the user had paused.
- A JSON `youtube` unit stalled the playlist.
- The first item of a playlist sometimes never started on the old ExoPlayer v1 renderer.
- Calling `pause()`, `play()`, `resumePlay()`, `seekTo()`, `setMute()` or `setVolume()` off the main thread crashed with "Player is accessed on the wrong thread" or did nothing. They now run on the main thread.
- A playlist break that was already preloaded was skipped, so a postroll never played.
- The next playlist break loaded only after the unit ended, not about 10 s before.
- A concurrent edit of the playlist could crash the app.
- A midroll in a playlist with several content units was shared between the units, so it triggered again in the next content, overlays accumulated and `%` offsets converted for the first content applied to the others. Each content unit now has its own copy.
- A playlist-level break did not hold the queue: calling `playMediaUnits()` during a preroll started content under the ad, and activity recreation replayed the preroll.
- After a unit that failed, its fallback was inserted at the start of the playlist and could play the failed unit again.
- `addOverlays()` converted `%` points with the wrong duration unit, and a text overlay added through it crashed when it triggered.
- `[CONTENTPLAYHEAD]` carried the ad playhead in ad units, and a postroll's `[MEDIAPLAYHEAD]` was always 0.
- A seek could leave a break it skipped to be preloaded and played.
- A reused playlist could stay in the preloading state and hang after `finish()` and `init()`.

VAST and VMAP

- A percent-offset (`%`) midroll break could trigger inside another midroll ad, replaying that ad and firing its impression, start and quartile pixels again. Present in 3.1.26.
- VMAP offsets such as `00:00:15.000` were dropped, so those midrolls never played.
- `breakStart` and `breakEnd` tracking was not parsed under `AdBreak` (the VMAP spec location), and a `breakStart` under `AdSource` threw a `NullPointerException`. `breakStart` now fires with the first ad's launch and `breakEnd` with the last ad's finish.
- A non-linear ad without `apiFramework` threw a `NullPointerException`.
- `followWrappers=false` threw a `NullPointerException` on ads that have wrappers. They are now dropped.
- The random multi-ad policy could pick a negative index and crash.
- Wrapper chains had no depth limit. A chain now stops after 5 hops and fires VAST error 302.
- VMAP `VASTAdData` (the spec element) was ignored. Both `VASTData` and `VASTAdData` are read.
- A numeric `skipButton.defaultOffset` in JSON threw a `ClassCastException`.
- A unit's or overlay's JSON `tracking` map threw a `ClassCastException`.
- VAST and VMAP parsing was open to XML external entity (XXE) attacks. External entities and external DTDs are no longer loaded. DOCTYPE declarations still parse.
- Response bodies of tracking pixels and SSAI calls were not closed, which leaked connections.
- VAST, configuration and image requests waited behind the license check. The license check and usage tracker now run on their own executor.

IMA

- An inline VMAP response threw a `ClassCastException` in the IMA break. It now plays through IMA.
- An IMA error followed by `ALL_ADS_COMPLETED` advanced the playlist twice, which skipped content.
- A non-linear IMA ad advanced the playlist when it finished and the playlist finished twice.
- Content kept playing under an IMA midroll. It now pauses for the duration of the break.
- Pausing, destroying or backing out before the ad manager loaded threw a `NullPointerException`.
- Each IMA break leaked a `WebView`. The ads loader is now released.
- IMA errors were logged with their obfuscated `toString()`. They are logged as code, number and message.
- Timed content events were scheduled on the ad's time during an IMA break. Content events now use content time, also when a break starts before the content duration is known.
- Same-offset VMAP breaks played at the same time. They now play one after another.
- The screen could turn off during an IMA preroll or postroll.
- During a non-linear IMA ad, `currentPlaybackTime()` and `duration()` reported ad progress and `pause()` did not pause the content.
- `skip()` and `next()` during an IMA preroll or postroll started the next item under the running ad.
- `seekTo` during an IMA midroll took its direction and limit from the ad.
- During a break without ad progress, the content time of a VOD item came from the live timer.
- Each IMA break's ad player kept native handles until garbage collection on Android 7.

Leaks and threads

- The SDK container views, the Media3 `PlayerView` and the playback controls no longer keep a destroyed Activity alive after an Activity recreation (present in 3.1.26). Before, the Activity leaked until `finish()`. These still hold the old Activity until they end or until `finish()`: the `MediaPlayerRenderer` and `CastRenderer` views; an IMA break prepared or playing during the recreation (its ad container, `AdsLoader` and ad player); other overlays on screen; the SDK fullscreen dialog (see Known limitations).
- The playback controls of finished units kept listening, so one tap sent one controls shown or hidden broadcast per unit played so far. Only the current unit's controls respond now.
- Every `finish()` and `init()` cycle leaked one handler thread.
- On Android 7, each played item leaked unix sockets and event handles until finalization.
- Late callbacks after `finish()` (ad requests, wrapper follow-ups, tracking pings, posted triggers, overlay updates and fade-outs, scheduled preloads) recreated an uninitialised player.
- The app's own `CookieHandler` was replaced by the SDK's. It is now installed only when none is set.

Cast

- The Cast idle check could end a unit twice.
- The Cast context started in `init()` even when Cast was not enabled.

### Known limitations

- The IMA engine does not render non-linear (overlay) ads. IMA reports `VAST_TRAFFICKING_ERROR` 200 ("nonlinear is not supported"), as in 3.1.26. Use the native engine (`setPreferGoogleIma(false)`) for non-linear ads.
- IMA ads always play on the device. While casting, content plays on the Cast receiver and IMA ads play on the phone. Native-engine ads play on the receiver with their tracking.
- An Activity recreated while the SDK fullscreen dialog (`enterFullscreen()`) is shown leaves the player's fullscreen state, dialog and inline parent on the destroyed Activity. The next `exitFullscreen()`, including the one at the end of the playlist or in `finish()` with `setLeaveFullscreenOnStop(true)` (the default), moves the player view into the destroyed Activity's layout and dismisses a detached dialog, which can throw `IllegalArgumentException` ("View not attached to window manager"). Present since 3.1.26. A `setFullscreenOrientationBehaviour()` that rotates the screen recreates an Activity that does not handle the rotation itself. Workaround: declare `android:configChanges="orientation|screenSize"` (and the other changes you expect) on the Activity that hosts the player, or call `exitFullscreen()` before a recreation.
- An IMA break starts its ads only while playback is not paused. If its ads finish loading while the user has paused (or the app is in the background), IMA's own error report for an ad it cannot play is sent when playback resumes, and not at all if the user leaves the player first. In 3.1.26 the error was reported as soon as the ads loaded.

### Security

- XML external entity (XXE) hardening in VAST and VMAP parsing: external general entities, external parameter entities and external DTD loading are disabled. Entities are not expanded.
- OkHttp 4.12.0, Gson 2.13.2 and jdom2 2.0.6.1 replace older versions.
