---
title: API reference
sidebar_label: API reference
description: Javadoc for the Veeplay Android SDK.
---

import AndroidReleaseNotice from '../../src/components/AndroidReleaseNotice';

<AndroidReleaseNotice />

The Javadoc for the public classes of the Veeplay Android SDK is at [docs.veeplay.com/android-player/](pathname:///android-player/). It opens in a new tab and documents the version shown above.

Where to start in the Javadoc:

- `com.appscend.media`: `APSMediaPlayer` (the player), `APSMediaBuilder` (JSON configuration and playlists) and `APSMediaTrackingEvents` (the events you can listen to).
- `com.appscend.media.events`: `APSMediaUnit` (content) and `APSVastAdBreak` (ads), plus the IMA break classes in `com.appscend.media.events.ima`.
- `com.appscend.overlaycontrollers`: the overlay and controls controllers.
- `com.appscend.utilities`: `VeeplayInsets`, `VeeplayBack` and the tracking event listener interface.
- `com.appscend.media.cast`: the Cast classes, available with the optional Cast artifact. See [Google Cast](google-cast.md).

Related references:

- [JSON configuration reference](/json-configuration/): every option of the JSON configuration, shared by all Veeplay players.
- [Events reference](/docs/video-player/events): the tracking events and their platform support.
