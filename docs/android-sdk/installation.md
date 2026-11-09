---
title: Installation
sidebar_label: Installation
description: Add the Veeplay Android SDK to your app with Gradle.
---

import AndroidReleaseNotice from '../../src/components/AndroidReleaseNotice';

Adding the SDK takes a repository line, a dependency and a few build settings.

<AndroidReleaseNotice />

## 1. Add the Maven repository

The SDK is published to a Maven repository hosted by Veeplay. Add it next to `mavenCentral()`:

```groovy
repositories {
    mavenCentral()
    maven { url "https://s3-eu-west-1.amazonaws.com/android.veeplay.com/releases" }
}
```

If your project declares repositories in `settings.gradle` (`dependencyResolutionManagement`), add the `maven` line there instead.

## 2. Add the dependency

```groovy
dependencies {
    implementation 'com.veeplay:veeplay-player-android:{{ANDROID_SDK_VERSION}}'
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.1.5'

    // optional, only for Google Cast
    implementation 'com.veeplay:veeplay-player-android-cast:{{ANDROID_SDK_VERSION}}'
}
```

| Artifact | Purpose |
| --- | --- |
| `com.veeplay:veeplay-player-android` | The player. Required. |
| `com.veeplay:veeplay-player-android-cast` | Google Cast support. Optional, see [Google Cast](google-cast.md). |

Use `desugar_jdk_libs` 2.1.5 or higher. The SDK does not ship it, so the choice of version is yours.

## 3. Set the build requirements

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
```

You also need Android Gradle Plugin 8.6.0 or higher, which in turn needs Gradle 8.7 or higher and JDK 17. If your AGP prints a warning that `compileSdk` 36 is newer than it was tested with, update the AGP rather than lowering `compileSdk`.

If your app declares `missingDimensionStrategy 'veeplaySDK', 'general'` in its product flavors, you can remove it. The SDK has no flavors any more.

## 4. Manifest

The player needs network access, so your app must declare the `INTERNET` permission if it does not already:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

The SDK declares its own activities, including the web browser used for ad clickthroughs, so you do not need to add them.

Only if you use Google Cast, also add the Cast options provider inside `<application>`:

```xml
<meta-data
    android:name="com.google.android.gms.cast.framework.OPTIONS_PROVIDER_CLASS_NAME"
    android:value="androidx.media3.cast.DefaultCastOptionsProvider" />
```

See [Google Cast](google-cast.md) for the rest of the Cast setup.

## 5. Register your app

Register your app's package name in your Veeplay account at [panel.veeplay.com/licenses](https://panel.veeplay.com/licenses). See [Licensing and network](licensing-and-network.md).

## Next step

Continue with the [Quick start](quick-start.md).
