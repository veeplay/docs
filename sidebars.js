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
        { type: 'doc', id: 'video-guides/how-video-streaming-works', label: 'Video Streaming' },
        { type: 'doc', id: 'video-guides/cmaf-streaming', label: 'CMAF' },
        { type: 'doc', id: 'video-guides/video-streaming-formats-device-support', label: 'Streaming Formats' },
        { type: 'doc', id: 'video-guides/video-codec-types-device-support', label: 'Video Codecs' },
        { type: 'doc', id: 'video-guides/video-container-types-device-support', label: 'Video Containers' },
      ],
    },
  ],
};
