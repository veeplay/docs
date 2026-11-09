---
title: Privacy
sidebar_label: Privacy
description: Cookies, advertising identifiers and permissions in the Veeplay Android SDK.
---

## Session cookies

VAST, ad tracking, SSAI and configuration requests use a session-only cookie jar that lives in memory. It is not written to disk and it is gone when your app's process ends. This lets ad servers that rely on session cookies work as they do on the web. In 3.1.26 the cookie store did not work, so no cookies were sent.

License and usage requests never send cookies. With the IMA engine, Google IMA makes its own ad and tracking requests.

Media requests go through a process-wide, in-memory `CookieManager` that the SDK installs only when your app has not set a `CookieHandler` of its own. The setting below does not change it.

### Turning cookies off

To send no cookies on those requests, as in 3.1.26, call this before `init()`:

```java
APSMediaPlayer.setSessionCookiesEnabled(false);
```

`APSMediaPlayer.isSessionCookiesEnabled()` returns the current setting. The method is static, so you can call it from your `Application` class.

To send no cookies on media requests either, set your own handler before `init()`:

```java
CookieHandler.setDefault(new CookieManager(null, CookiePolicy.ACCEPT_NONE));
```

The SDK installs a process-wide `CookieHandler` only if your app has not set one. It no longer replaces yours.

## Advertising identifier

If you want ad requests to carry an advertising identifier, pass it with `setAdvertisingIdentifier()` (and `setAdvertisingIdentifierType()`) on `APSMediaPlayer`. Whether and when you obtain and pass it is your app's decision.

## Permissions added by the player's dependencies

The Google IMA SDK 3.40 is part of the player. It adds these permissions to your merged manifest:

- `android.permission.INTERNET`
- `com.google.android.gms.permission.AD_ID`
- `android.permission.ACCESS_ADSERVICES_ATTRIBUTION`
- `android.permission.ACCESS_ADSERVICES_AD_ID`
- `android.permission.AD_SERVICES_CONFIG`

Media3 ExoPlayer adds `android.permission.WAKE_LOCK`.

Apps that use the Google Mobile Ads or Next-Gen Ads SDK already declare `AD_ID`. If you do not want the advertising permissions, remove them in your manifest:

```xml
<uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove" />
```

Add a matching line for each of the other permissions you want to drop, and declare the `tools` namespace (`xmlns:tools="http://schemas.android.com/tools"`) on your `<manifest>` element. Removing `AD_ID` means that on Android 13 and higher the advertising ID reads as zeros, so IMA ad requests carry no ID. Check your advertising ID declaration in the Play Console so that it matches what your app does.
