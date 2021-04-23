# DASH .mpd Manifests

Veeplay supports `.mpd` live and video on demand (VOD) manifests that follow the guidelines for the DASH dynamic profile. Veeplay accepts multi-period and single-period DASH-compliant manifest inputs, and delivers multi-period DASH-compliant manifest outputs.

DASH manifests must satisfy the following requirements:
+ Manifests must be accessible on the public internet.
+ Manifests must be live or video on demand (VOD).
+ Manifests must mark events as ad avails using either splice insert markers or time signal markers. You can provide the ad markers in clear XML or in base64-encoded binary. For splice insert, the out-of-network indicator must be enabled. For time signal markers, the segmentation type ID, located inside the segmentation UPID, must be a cue-out value recognized by Veeplay. The ad avail starts at the event start and lasts for the event duration, if one is specified, or until the next event starts. 

  The following example shows an event designated as an ad avail using splice insert markers. The duration for this ad avail is the event's duration. 

  ```
    <Period start="PT444806.040S" id="123586" duration="PT15.000S">
      <EventStream timescale="90000" schemeIdUri="urn:scte:scte35:2013:xml">
        <Event duration="1350000">
          <scte35:SpliceInfoSection protocolVersion="0" ptsAdjustment="180832" tier="4095">
            <scte35:SpliceInsert spliceEventId="4026531855" spliceEventCancelIndicator="false" outOfNetworkIndicator="true" spliceImmediateFlag="false" uniqueProgramId="1" availNum="1" availsExpected="1">
              <scte35:Program><scte35:SpliceTime ptsTime="5672624400"/></scte35:Program>
              <scte35:BreakDuration autoReturn="true" duration="1350000"/>
            </scte35:SpliceInsert>
          </scte35:SpliceInfoSection>
        </Event>
      </EventStream>
      <AdaptationSet mimeType="video/mp4" 
          ...
      </AdaptationSet>
    </Period>
  ```
+ Ad avails must have the same `AdaptationSet` and `Representation` settings as content streams. Veeplay uses these settings to transcode the ads to match the content stream, for smooth switching between the two.

Input manifests must have the following:
+ At least one `Period` element with a `start` attribute. 
+ SCTE-35 event streams with splice info settings for either `splice insert `or` time signal`. The settings can be provided in clear XML or in base64-encoded binary. 
+ `Segment templates` with `segment timelines`. 

For published manifests, Veeplay requires that updates by the origin server leave the following unchanged: 
+ Period start times, specified in the `start` attribute. 
+ Values of `presentationTimeOffset` in the segment templates of the period representations. 

As a best practice, give the ad avails the same `AdaptationSet` and `Representation` settings as the content stream periods. Veeplay uses these settings to transcode the ads to match the content stream, for smooth switching between the two.

## DASH Ad Avail Duration

During playback, when Veeplay encounters an ad avail, it replaces some or all of the avail with ads. Veeplay starts ad replacement at the beginning of the ad avail and includes ads as follows: 
+ If the ad avail specifies a duration, Veeplay includes as many ads as it can fit inside the duration boundary, without overwriting content that follows. 
+ If no duration is provided, Veeplay includes ads until it reaches the end of the ad avail. For multi-period manifests, this is the end of the period. For single-period manifests, this is the end of the event. Veeplay doesn't play ads past the end of the ad avail and, when it encounters the end, truncates the current ad instead of overwriting the content that follows. 

**How Veeplay looks for the ad avail duration**  
Veeplay searches for a duration setting in the following order: 

1. `Event` `duration`

2. For splice insert, the `scte35:BreakDuration` `duration`

3. For time signal, the `scte35:SegmentationDescriptor` `segmentationDuration`

If Veeplay doesn't find any of these settings, it manages ad inclusion without a duration. 

The following example shows an `Event` that has a `duration`.

```
  <Period start="PT444806.040S" id="123586" duration="PT15.000S">
    <EventStream timescale="90000" schemeIdUri="urn:scte:scte35:2013:xml">
      <Event duration="1350000">
        <scte35:SpliceInfoSection protocolVersion="0" ptsAdjustment="180832" tier="4095">
          <scte35:SpliceInsert spliceEventId="4026531855" spliceEventCancelIndicator="false" outOfNetworkIndicator="true" spliceImmediateFlag="false" uniqueProgramId="1" availNum="1" availsExpected="1">
            <scte35:Program><scte35:SpliceTime ptsTime="5672624400"/></scte35:Program>
            <scte35:BreakDuration autoReturn="true" duration="1350000"/>
          </scte35:SpliceInsert>
        </scte35:SpliceInfoSection>
      </Event>
        ...
```

The following example shows ad avail with no duration specified. The `Event` has no `duration` and the `scte35:SpliceInsert` element doesn't contain a `scte35:BreakDuration` child element.

```
  <Period start="PT444836.720S" id="123597" duration="PT12.280S">
    <EventStream timescale="90000" schemeIdUri="urn:scte:scte35:2013:xml">
      <Event>
        <scte35:SpliceInfoSection protocolVersion="0" ptsAdjustment="180832" tier="4095">
          <scte35:SpliceInsert spliceEventId="4026531856" spliceEventCancelIndicator="false" outOfNetworkIndicator="true" spliceImmediateFlag="false" uniqueProgramId="1" availNum="1" availsExpected="1">
            <scte35:Program><scte35:SpliceTime ptsTime="5675385600"/></scte35:Program>
          </scte35:SpliceInsert>
        </scte35:SpliceInfoSection>
      </Event>
      ...
```

## DASH Ad Markers

Veeplay identifies ad avails in a DASH manifest by splice insert and time signal cue-out markers, as follows: 

+ In a multi-period DASH manifest, a `Period` is considered an ad avail when the first `Event` in its event stream contains splice insert or time signal cue-out markers. In multi-period DASH, Veeplay ignores all but the first event in a period.
+ In a single-period DASH manifest, an `Event` is considered an ad avail when it contains splice insert or time signal cue-out markers.

By default, Veeplay manages DASH manifests as multi-period manifests.

You can provide ad markers in clear XML or in base64-encoded binary:

**Clear XML**  
The event stream `schemeIdUri` must be set to `urn:scte:scte35:2013:xml`, and the event must have `scte35:SpliceInfoSection` markers containing one of the following: 
+ `scte35:SpliceInsert` with `outOfNetworkIndicator` set to `true`

  The following example shows this option, with the required markers in bold. 

  ```
    <Period start="PT444806.040S" id="123586" duration="PT15.000S">
      <EventStream timescale="90000" schemeIdUri="urn:scte:scte35:2013:xml">
        <Event duration="1350000">
          <scte35:SpliceInfoSection protocolVersion="0" ptsAdjustment="180832" tier="4095">
            <scte35:SpliceInsert spliceEventId="4026531855" spliceEventCancelIndicator="false" outOfNetworkIndicator="true" spliceImmediateFlag="false" uniqueProgramId="1" availNum="1" availsExpected="1">
              <scte35:Program><scte35:SpliceTime ptsTime="5672624400"/></scte35:Program>
              <scte35:BreakDuration autoReturn="true" duration="1350000"/>
            </scte35:SpliceInsert>
          </scte35:SpliceInfoSection>
        </Event>
  ```
+ `scte35:TimeSignal` accompanied by `scte35:SegmentationDescriptor` `scte35:SegmentationUpid` with `segmentationTypeId` set to one of the following cue-out numbers: 
  + 0x22 \(start break\)
  + 0x30 \(provider advertisement start\)
  + 0x32 \(distributor advertisement start\)
  + 0x34 \(provider placement opportunity start\)
  + 0x36 \(distributor placement opportunity start\)

  The following example shows this option, with the required markers in bold. The `segmentationTypeId` in this example is set to 52, equivalent to 0x34. 

  ```
    <Period start="PT346530.250S" id="178443" duration="PT61.561S">
      <EventStream timescale="90000" schemeIdUri="urn:scte:scte35:2013:xml">
        <Event duration="5310000">
          <scte35:SpliceInfoSection protocolVersion="0" ptsAdjustment="183003" tier="4095">
            <scte35:TimeSignal>
              <scte35:SpliceTime ptsTime="3442857000"/>
            </scte35:TimeSignal>
            <scte35:SegmentationDescriptor segmentationEventId="1414668" segmentationEventCancelIndicator="false" segmentationDuration="8100000">
              <scte35:DeliveryRestrictions webDeliveryAllowedFlag="false" noRegionalBlackoutFlag="false" archiveAllowedFlag="false" deviceRestrictions="3"/>
              <scte35:SegmentationUpid segmentationUpidType="12" segmentationUpidLength="2" segmentationTypeId="52" segmentNum="0" segmentsExpected="0">0100</scte35:SegmentationUpid>
            </scte35:SegmentationDescriptor>
          </scte35:SpliceInfoSection>
        </Event>
  ```

**Base64-encoded binary**  
The event stream `schemeIdUri` must be set to `urn:scte:scte35:2014:xml+bin`, and the event must have `scte35:Signal` `scte35:Binary` that contains a base64-encoded binary. The decoded binary must provide a `splice_info_section` with the same set of information as the clear XML would provide in a `scte35:SpliceInfoSection` element. The command type must be either `splice_insert()` or `time_signal()`, and the additional settings must comply with those described previously for clear XML delivery. 

The following example shows this option, with the required markers in bold.

```
  <Period start="PT444806.040S" id="123586" duration="PT15.000S">
    <EventStream schemeIdUri="urn:scte:scte35:2014:xml+bin" timescale="1">
      <Event presentationTime="1541436240" duration="24" id="29">
        <scte35:Signal xmlns="http://www.scte.org/schemas/35/2016">
          <scte35:Binary>/DAhAAAAAAAAAP/wEAUAAAHAf+9/fgAg9YDAAAAAAAA25aoh</Binary>
        </scte35:Signal>
      </Event>
      <Event presentationTime="1541436360" duration="24" id="30">
        <scte35:Signal xmlns="http://www.scte.org/schemas/35/2016">
          <scte35:Binary>QW5vdGhlciB0ZXN0IHN0cmluZyBmb3IgZW5jb2RpbmcgdG8gQmFzZTY0IGVuY29kZWQgYmluYXJ5Lg==</Binary>
        </scte35:Signal>
      </Event>
```

The following is the decoded binary for the first event listed in the preceding example. The setting for `splice_command_type` is 5, which indicates `splice_insert`. 

```
{
  "table_id": 252,
  "section_syntax_indicator": false,
  "private_indicator": false,
  "section_length": 33,
  "protocol_version": 0,
  "encrypted_packet": false,
  "encryption_algorithm": 0,
  "pts_adjustment": 0,
  "cw_index": 0,
  "tier": "0xFFF",
  "splice_command_length": 16,
  "splice_command_type": 5,
  "splice_command": {
    "splice_event_id": 448,
    "splice_event_cancel_indicator": false,
    "out_of_network_indicator": true,
    "program_splice_flag": true,
    "duration_flag": true,
    "splice_immediate_flag": false,
    "utc_splice_time": {
      "time_specified_flag": false,
      "pts_time": null
    },
    "component_count": 0,
    "components": null,
    "break_duration": {
      "auto_return": false,
      "duration": {
        "pts_time": 2160000,
        "wall_clock_seconds": 24.0,
        "wall_clock_time": "00:00:24:00000"
      }
    },
    "unique_program_id": 49152,
    "avail_num": 0,
    "avails_expected": 0
  },
  "splice_descriptor_loop_length": 0,
  "splice_descriptors": null,
  "Scte35Exception": {
    "parse_status": "SCTE-35 cue parsing completed with 0 errors.",
    "error_messages": [],
    "table_id": 252,
    "splice_command_type": 5
  }
}
```

For multi-period DASH manifests, Veeplay considers only the first `Event` in an event stream to determine ad replacement markers, and it ignores any additional `Event` markers in the stream. For single-period DASH manifests, Veeplay considers each `Event`.
