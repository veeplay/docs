---
title: Veeplay Android SDK
sidebar_label: Overview
description: Overview and requirements of the Veeplay Video Player SDK for Android 3.2.
---

import AndroidReleaseNotice from '../../src/components/AndroidReleaseNotice';

The Veeplay SDK for Android is a library for video playback and monetization in your Android app. It plays HLS, DASH, SmoothStreaming and MP4 streams, shows VAST ads as prerolls, midrolls and postrolls, and supports native or HTML overlays and custom overlay controllers.

You configure playback with the same [JSON configuration](/json-configuration/) that the iOS and JavaScript players use, or build your playlist in code.

<AndroidReleaseNotice />

## What is in version 3.2

- **Media3 playback.** Video is rendered with Google's Media3 ExoPlayer. One renderer now covers HLS, DASH, SmoothStreaming and progressive streams.
- **Google IMA SDK 3.40.** You can choose between Veeplay's native VAST/VMAP engine and Google IMA for ads. See [Ads](ads.md).
- **Optional Google Cast.** Cast is a separate artifact, so apps that do not cast carry no Cast code. See [Google Cast](google-cast.md).
- **Android 15 and 16.** Edge-to-edge and immersive fullscreen, predictive back and display cutout handling. See [Fullscreen, edge-to-edge and predictive back](fullscreen-and-insets.md).

The public API stays source-compatible with 3.1.26, apart from the removed ExoPlayer v1, YouTube and MRAID APIs, so upgrading is mostly a matter of build settings. The [migration guide](migration-3-2.md) walks through it.

## Requirements

| Item | Requirement |
| --- | --- |
| `minSdk` | 24 or higher |
| `compileSdk` | 36 or higher |
| Android Gradle Plugin | 8.6.0 or higher (AGP 8.6 itself needs Gradle 8.7 or higher and JDK 17) |
| Core library desugaring | Enabled |
| Java | 11 source and target compatibility |

The optional Cast artifact has the same requirements. Kotlin apps that add it need the Kotlin Gradle plugin 2.1 or higher. The core artifact adds no Kotlin requirement.

Keep Gson on 2.13.x: a newer Gson makes JSON configuration fail. If your app still has a `com.google.android.exoplayer` (ExoPlayer 2) dependency, remove it, because its resources clash with Media3's.

These are build-time settings that you change once in your Gradle files. [Installation](installation.md) has the snippets.

## Where to go next

1. [Installation](installation.md): add the repository and the dependency.
2. [Quick start](quick-start.md): show a first video.
3. [Ads](ads.md), [Google Cast](google-cast.md), [Fullscreen, edge-to-edge and predictive back](fullscreen-and-insets.md): add the features you need.
4. [Licensing and network](licensing-and-network.md), [Privacy](privacy.md) and [R8 / ProGuard](proguard-r8.md): what to check before you release.
5. [Migrating from 3.1 to 3.2](migration-3-2.md) and the [Changelog](changelog.md).
6. [API reference](api-reference.md): the Javadoc for every public class.
