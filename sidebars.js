module.exports = {
  ssaiSidebar: [
    {
      type: 'category',
      label: 'Server-Side Ad Insertion',
      items: [
        'ssai/index',
        'ssai/creating-a-configuration',
        'ssai/ad-behavior',
        'ssai/ad-tracking',
        'ssai/manifest-audio-captions',
        'ssai/manifest-dash',
        'ssai/manifest-hls',
        'ssai/monitoring',
        'ssai/slate-management',
        'ssai/variables',
        'ssai/vast-vmap-vpaid',
      ],
    },
  ],
  videoGuidesSidebar: [
    {
      type: 'category',
      label: 'Guides to Web Video',
      items: [
        {
          type: 'doc',
          id: 'video-guides/how-video-streaming-works',
          label: 'Video Streaming',
        },
        { type: 'doc', id: 'video-guides/cmaf-streaming', label: 'CMAF' },
        {
          type: 'doc',
          id: 'video-guides/video-streaming-formats-device-support',
          label: 'Streaming Formats',
        },
        {
          type: 'doc',
          id: 'video-guides/video-codec-types-device-support',
          label: 'Video Codecs',
        },
        {
          type: 'doc',
          id: 'video-guides/video-container-types-device-support',
          label: 'Video Containers',
        },
        {
          type: 'doc',
          id: 'video-guides/supported-media-by-device',
          label: 'Device Media Support',
        },
      ],
    },
  ],
  faqSidebar: [
    {
      type: 'category',
      label: 'Veeplay FAQ',
      items: [
        { type: 'doc', id: 'faq/transcoding-api', label: 'Transcoding API' },
        { type: 'doc', id: 'faq/video-player', label: 'Video Player' },
      ],
    },
  ],
  javascriptPlayerExamplesSidebar: [
    {
      type: 'category',
      label: 'JS Video Player Examples',
      items: [
        {
          type: 'doc',
          id: 'examples/js/simple-vanilla',
          label: 'Simple Setup Using Vanilla JS',
        },
        {
          type: 'doc',
          id: 'examples/js/simple-react',
          label: 'Simple Setup Using React',
        },
        {
          type: 'doc',
          id: 'examples/js/playlist-ui',
          label: 'Create a Playlist UI',
        },
        {
          type: 'doc',
          id: 'examples/js/playlist-internal',
          label: 'Playback a Series of Videos',
        },
        {
          type: 'doc',
          id: 'examples/js/arbitrary-time',
          label: 'Playback at Arbitrary Time',
        },
        {
          type: 'doc',
          id: 'examples/js/ads',
          label: 'Preroll And Midroll Ads Via VAST',
        },
        {
          type: 'doc',
          id: 'examples/js/image-overlay',
          label: 'Create an Image Overlay',
        },
        {
          type: 'doc',
          id: 'examples/js/custom-overlay',
          label: 'Create a Custom Overlay',
        },
      ],
    },
  ],
};
