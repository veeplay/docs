---
title: Licensing and network
sidebar_label: Licensing and network
description: How the Veeplay Android SDK checks your license, and which network destinations your app needs to allow.
---

The Veeplay SDK checks your license and reports usage in the background. For most apps there is nothing to do except register your package name once.

## Register your app

Register your app's package name in your Veeplay account at [panel.veeplay.com/licenses](https://panel.veeplay.com/licenses). If a package is not registered, or the license is invalid, playback reports an "Invalid License" error. See the [Video Player FAQ](/docs/faq/video-player).

## Network destinations

License and usage requests go to `panel.veeplay.com` on port `5201`. In version 3.1.26 the host was `panel.veeso.co:5201`.

If your app restricts network destinations, for example through a network security config, a firewall or a proxy allowlist, add `panel.veeplay.com:5201` to it. Apps that do not restrict destinations need no change.

Your video, ad and tracking requests go to the hosts in your own configuration, as before.

## What the check does and does not do

- The license check and the usage tracker run on their own executor, so **playback never waits for them**.
- An **unreachable license server does not stop playback**.
- With an invalid license, the server's answer can arrive after a preroll has already started.
- License and usage requests do not send cookies. See [Privacy](privacy.md).
