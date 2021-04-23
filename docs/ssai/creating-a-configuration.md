# Creating an Endpoint Configuration

Create a configuration to start receiving content streams and to provide an access point for downstream playback devices to request content.

In order to do this, navigate to https://panel.veeplay.com and login using your Veeplay credentials. All SSAI settings are grouped inside the SSAI tab on the main menu.

Fill in the following inputs:

+ **VAST URL** - this is the endpoint that will be polled whenever the stream is requested. Our backend will expect that the response at this URL will either be a VAST tag, or a VMAP tag in case you're looking to use VMAP in order to schedule ad breaks.

+ **HLS or DASH content URL** - this is the base URL of your CDN where HLS or DASH manifests are stored. Do not point directly to one of your manifests, just to the folder where these are stored. The name of the manifest should be appended to the generated links.

+ **Slate MP4 URL** - this is an optional MP4 slate that is used to fill gaps in media content.

After clicking Save, a set of 2 base URLs will be generated. You can append the name of any manifest available at the original URL in order to get links to specific streams on your CDN:

- an HLS endpoint, usable with any HLS enabled player;
- a DASH endpoint, usable with any DASH enabled player.

By default, server-side reporting will be used. See the docs on setting up client-side reporting.