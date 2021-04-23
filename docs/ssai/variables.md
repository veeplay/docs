# Sending Data to the Ad Server

The Veeplay request to the ad server can include information about the current viewing session, which helps the server choose the best ads to provide in its response.

The query parameters you can send take the following forms:
+ **Static values** – values that don't change from one session to the next.
+ **Session data** – dynamic values that are provided by Veeplay for each session - for example, the session ID.
+ **Player data** – dynamic values that are provided by the player for each session. These describe the content viewer and help the ad server to determine which ads Veeplay should stitch into the stream.

## Session Data

You can use the following session data variables in your template ad request URL configuration: 
+ **[avail.random]** – a random number between 0 and 10,000,000,000 that Veeplay generates for each request to the ad server. Some ad servers use this parameter to enable features such as separating ads from competing companies.
+ **[scte.avail_num]** – the value parsed by Veeplay from the SCTE-35 field `avail_num`. Veeplay can use this value to designate linear ad avail numbers.
+ **[scte.event_id]** – the value parsed by Veeplay from the SCTE-35 field `splice_event_id`, as a long number. Veeplay uses this value to designate linear ad avail numbers or to populate ad server query strings, like ad pod positions.
+ **[scte.unique_program_id]** – the value parsed by Veeplay from the SCTE-35 `splice_insert` field `unique_program_id`. The ad server uses the unique program ID (UPID) to provide program-level ad targeting for live linear streams. If the SCTE-35 command is not splice insert, Veeplay sets this to an empty value.
+ **[session.avail_duration_ms]** – the duration in milliseconds of the ad availability slot. The default value is 300,000 ms. Veeplay obtains the duration value from the input manifest as follows: 
  + For HLS, Veeplay obtains the duration from the `#EXT-X-CUE-OUT: DURATION` or from values in the `#EXT-X-DATERANGE` tag. If the input manifest has a null, invalid, or 0 duration for the ad avail in those tags, Veeplay uses the default. 
  + For DASH, Veeplay obtains the duration value from the event duration, if one is specified. Otherwise, it uses the default value. 
+ **[session.avail_duration_secs]** – the duration in seconds of the ad availability slot, or ad avail. Veeplay determines this value the same way it determines `[session.avail_duration_ms]`.
+ **[session.client_ip]** – the remote IP address that the Veeplay request came from. If the `X-forwarded-for` header is set, then that value is what Veeplay uses for the `client_ip`.
+ **[session.id]** – a unique numeric identifier for the current playback session. All requests that a player makes for a session have the same id, so it can be used for ad server fields that are intended to correlate requests for a single viewing.
+ **[session.referer]** – usually, the URL of the page that is hosting the video player. Veeplay sets this variable to the value of the `Referer` header that the player used in its request to Veeplay. If the player doesn't provide this header, Veeplay leaves the **[session.referer]** empty. If you use a CDN or proxy in front of the manifest endpoint and you want this variable to appear, proxy the correct header from the player here.
+ **[session.user_agent]** – the `User-Agent` header that Veeplay received from the player’s session initialization request. If you're using a CDN or proxy in front of the manifest endpoint, you must proxy the correct header from the player here.
+ **[session.uuid]** – alternative to **[session.id]**. This is a unique identifier for the current playback session, such as the following: 

  ```
  e039fd39-09f0-46b2-aca9-9871cc116cde
  ```

**Examples**  
If the ad server requires a query parameter named `deviceSession` to be passed with the unique session identifier, the template ad server URL could look like the following:  

```
https://my.ads.server.com/path?deviceSession=[session.id]
```
Veeplay automatically generates a unique identifier for each stream, and enters the identifier in place of `session.id`. If the identifier is `1234567`, the final request that Veeplay makes to the ad server would look something like this:  

```
https://my.ads.server.com/path?deviceSession=1234567
```

## Player Data

To configure Veeplay to send data received from the player to the ad server, in the template URL, specify `player_params.<query_parameter_name>` variables. For example, if the player sends a query parameter named `user_id` in its request to Veeplay, to pass that data in the ad server request, include `[player_params.user_id]` in the URL configuration. 

**To add query parameters as key-value pairs** 

1. In Veeplay, configure the ad server request template URL to reference the parameters. The following URL shows the inclusion of the example parameters: 

   ```
   https://my.ads.com/path?param1=[player_params.param1]&param2=[player_params.param2]
   ```

2. (Optional) For server-side ad-tracking, URL-encode the key-value pairs on the player. When Veeplay receives the session initialization request, it URL-decodes the values once before substituting them into the ad server request URL. 

> If your ad server requires a URL-encoded value, URL-encode the value twice on the player. This way, the decoding done by Veeplay results in a once-encoded value for the ad server. For example, if the decoded representation of the values sent to the ADS is `param1=value1:&param2=value2:`, then the URL-encoded representation is `param1=value1%3A&param2=value2%3A`.

3. In the initialization call from the player, pass the key-value pairs to Veeplay as the value of a single query parameter. Prefix the parameters that you want Veeplay to send to the ad server with `ads`. Leave the prefix off for parameters that you want Veeplay to send to the origin server: 
   + Example requests:

     ```
     <master>.m3u8?ads.param1=value1&ads.param2=value2&auth_token=kjhdsaf7gh

     <manifest>.mpd?ads.param1=value1&ads.param2=value2&auth_token=kjhdsaf7gh
     ```
   + Veeplay sends the following request to the ad server:
      ```
      https://my.ads.com/<path>?param1=value1:&param2=value2:
      ```
   + Veeplay calls the origin server with the player's authorization token.
      ```
      https://my.origin.server.com/master.m3u8?auth_token=kjhdsaf7gh

      https://my.origin.server.com/manifest.mpd?auth_token=kjhdsaf7gh
      ```
