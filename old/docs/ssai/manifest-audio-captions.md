# Alternate Audio and Subtitles

Veeplay supports input and output of multiple audio and WebVTT subtitle tracks. 

## Audio

If your content contains alternate audio, Veeplay transcodes audio-only renditions of the ads to the alternate audio tracks for your content. This way, audio switching continues to work during ads. The service inserts the default audio from the ad and replicates it across your audio tracks during ad avails.

> For ad transcoding to succeed, the audio sample rate must be from 16 to 320 kHz.

## Subtitles

Ad playback doesn't include subtitles. Instead, Veeplay inserts blank offsets for the webVTT sidecar files during ad avails. 

For DASH, Veeplay supports in-band subtitles.