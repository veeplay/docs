---
title: Video Player FAQ
description: Quick answers to all Veeplay Video Player related questions.
---

### Playback doesn't work and I'm seeing an "Invalid License" error in the console.
To use the Veeplay video players within your mobile or web apps, you need to register them inside your [Veeplay account dashboard](https://panel.veeplay.com):
- for iOS, you'll need to specify your app's bundle identifier;
- for Android, you'll need to specify your app's package name;
- for web apps, you can use the player on `localhost` without registering an app - otherwise, you'll need to specify your app's domain name.

### Can I autoplay videos?
To improve user experience, browsers and OSs enforce strict policies regarding video autoplay. Generally, autoplay is only allowed without sound before the user interacts with your app/domain in a meaningful way.
- For **Chrome**, video is also allowed to autoplay with sound, depending on the users' Media Engagement Index(MEI). This is a measurement of previous user interaction with a specific domain, and is highest on sites where you regularly play media. See [your local MEI scores](chrome://media-engagement/) and read more about [Chrome autoplay policies](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes).
- For **Safari**, the user is in control over which sites are allowed to autoplay. By default, autoplay executes only if the video doesn’t contain an audio track, or if the video is muted. Read more about [Safari's autoplay policy](https://developer.apple.com/documentation/webkit/delivering_video_content_for_safari).
- For **Firefox**, all video with sound is prevented from autoplay by default. Read more about [Firefox's autoplay policy](https://support.mozilla.org/en-US/kb/block-autoplay).

To make sure your video will autoplay, set the player to mute after starting playback:

```js
// Instruct the player to start playback
player.playMediaUnits(units);
player.setMute();
```

### Can I customize the player controls UI?
Yes, UI customizations are supported. See a list of [controls customization options](/json-configuration/#root.properties.content.items.properties.controls) for JSON configuration. Similar properties are also natively available for each platform.

### Can I instantiate multiple players?
The Android & iOS players are singletons, so you can only have a single player instance at a time.
Multiple players are, however, supported with the JS SDK:

```html
<div id="player-one"></div>
<div id="player-two"></div>
<script src="https://cdn.veeplay.com/veeplay-web/latest/mp.bundle.js"></script>
<script>
const playerOne = new MediaPlayer('player-one');
const playerTwo = new MediaPlayer('player-two');
playerOne.playMediaUnits([ new MediaUnit(firstUrl) ]);
playerTwo.playMediaUnits([ new MediaUnit(secondUrl) ]);
</script>
```
