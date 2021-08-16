import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const DocsMainPage = () => {
  return (
    <Container className="mt-5" style={{ marginBottom: '84px' }}>
      <Row className="mt-5">
        <Col md={12}>
          <h1 className="heading-h1">Veeplay documentation</h1>
          <p
            className="heading-h4"
            style={{ fontWeight: 'normal', color: '#717171' }}
          >
            References and Guides for the Veeplay Video SDKs and APIs
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mt-5">
          <img
            className="w-100"
            src="/assets/video-api-computer.svg"
            alt="Video API Graphic"
          />
          <div style={{ marginTop: '32px', marginLeft: '48px' }}>
            <p className="docs-heading">Video API</p>
            <div>
              <div className="blue-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/video-api/#section/Introduction"
                target="_blank"
                rel="noreferrer"
              >
                Introduction
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="blue-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/video-api/#section/Supported-Inputs"
                target="_blank"
                rel="noreferrer"
              >
                Supported inputs
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="blue-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/video-api/#section/Smart-Adaptive-Output"
                target="_blank"
                rel="noreferrer"
              >
                Smart adaptive output
              </a>
            </div>
          </div>
        </Col>
        <Col md={6} className="mt-5">
          <img
            className="w-100"
            src="/assets/ssai-graphic.svg"
            alt="SSAI Graphic"
          />
          <div style={{ marginTop: '32px', marginLeft: '48px' }}>
            <p className="docs-heading">Server-Side Ad Insertion</p>
            <div>
              <div className="purple-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/docs/ssai/index/"
                target="_blank"
                rel="noreferrer"
              >
                Introduction
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="purple-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/docs/ssai/ad-tracking/"
                target="_blank"
                rel="noreferrer"
              >
                Ad tracking & reporting
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="purple-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/docs/ssai/manifest-dash/"
                target="_blank"
                rel="noreferrer"
              >
                DASH support
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="purple-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/docs/ssai/manifest-hls/"
                target="_blank"
                rel="noreferrer"
              >
                HLS support
              </a>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mt-5">
          <img
            className="w-100"
            src="/assets/JSGuideGraphic.svg"
            alt="JavaScript Graphic"
          />
          <div style={{ marginTop: '32px', marginLeft: '48px' }}>
            <p className="docs-heading">JavaScript Player SDK</p>
            <div>
              <div className="yellow-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/javascript-player/"
                target="_blank"
                rel="noreferrer"
              >
                Introduction
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="yellow-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/javascript-player/#using-with-react"
                target="_blank"
                rel="noreferrer"
              >
                Using with React
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="yellow-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/javascript-player/MediaPlayer.html"
                target="_blank"
                rel="noreferrer"
              >
                Player class reference
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="yellow-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/javascript-player/MediaBuilder.html"
                target="_blank"
                rel="noreferrer"
              >
                Builder class reference
              </a>
            </div>
          </div>
        </Col>
        <Col md={6} className="mt-5">
          <img
            className="w-100"
            src="/assets/iOSGuideGraphic.svg"
            alt="iOS Graphic"
          />
          <div style={{ marginTop: '32px', marginLeft: '48px' }}>
            <p className="docs-heading">iOS Player SDK</p>
            <div>
              <div className="gray-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/ios-player/readme.html"
                target="_blank"
                rel="noreferrer"
              >
                Introduction
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="gray-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/ios-player/Classes/APSMediaPlayer.html"
                target="_blank"
                rel="noreferrer"
              >
                Player class reference
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="gray-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/ios-player/Classes/APSMediaBuilder.html"
                target="_blank"
                rel="noreferrer"
              >
                Builder class reference
              </a>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mt-5">
          <img
            className="w-100"
            src="/assets/AndroidGuideGraphic.svg"
            alt="Android Graphic"
          />
          <div style={{ marginTop: '32px', marginLeft: '48px' }}>
            <p className="docs-heading">Android Player SDK</p>
            <div>
              <div className="yellow-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/android-player/"
                target="_blank"
                rel="noreferrer"
              >
                Class reference
              </a>
            </div>
          </div>
        </Col>
        <Col md={6} className="mt-5">
          <img
            className="w-100"
            src="/assets/json-graphic.svg"
            alt="JSON Graphic"
          />
          <div style={{ marginTop: '32px', marginLeft: '48px' }}>
            <p className="docs-heading">JSON Player Configuration</p>
            <div>
              <div className="blue-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/json-configuration/"
                target="_blank"
                rel="noreferrer"
              >
                JSON reference
              </a>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mt-5">
          <img
            className="w-100"
            src="/assets/web-video-graphic.svg"
            alt="Web Video Graphic"
          />
          <div style={{ marginTop: '32px', marginLeft: '48px' }}>
            <p className="docs-heading">Web Video Guides</p>
            <div>
              <div className="blue-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/docs/video-guides/how-video-streaming-works/"
                target="_blank"
                rel="noreferrer"
              >
                How Video Streaming Works
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="blue-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/docs/video-guides/cmaf-streaming"
                target="_blank"
                rel="noreferrer"
              >
                CMAF Video Streaming
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="blue-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/docs/video-guides/video-codec-types-device-support/"
                target="_blank"
                rel="noreferrer"
              >
                Video Codec Guide
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="blue-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/docs/video-guides/video-container-types-device-support/"
                target="_blank"
                rel="noreferrer"
              >
                Video Container Guide
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div className="blue-bullet" />
              <a
                className="docs-list-item"
                href="https://docs.veeplay.com/docs/video-guides/video-streaming-formats-device-support/"
                target="_blank"
                rel="noreferrer"
              >
                Video Streaming Formats Guide
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DocsMainPage;
