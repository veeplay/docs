import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        background: '#002641',
        position: 'absolute',
        width: '100%',
      }}
    >
      <div className="footer-container">
        <div className="footer-divs">
          <p className="heading-h4" style={{ color: 'white' }}>
            Docs
          </p>
          <div className="footer-div-docs">
            <div className="footer-div-docs-sub-1">
              <div style={{ marginRight: '48px' }}>
                <p className="footer-items">Video API</p>
                <p className="footer-items">Server-Side Ad Insertion</p>
                <p className="footer-items">JSON Configuration</p>
              </div>
              <div>
                <p className="footer-items">JavaScript Video Player</p>
                <p className="footer-items"> iOS Video Player</p>
                <p className="footer-items">Android Video Player</p>
              </div>
            </div>
            <div className="footer-div-docs-sub-2">
              <div className="footer-div-docs-1">
                <div style={{ marginRight: '48px' }}>
                  <p className="footer-items">Video API</p>
                  <p className="footer-items">Server-Side Ad Insertion</p>
                </div>
                <div style={{ marginRight: '48px' }}>
                  <p className="footer-items">JavaScript Video Player</p>
                  <p className="footer-items"> iOS Video Player</p>
                </div>
              </div>
              <div className="footer-div-docs-2">
                <p className="footer-items footer-item-json">
                  JSON Configuration
                </p>
                <p className="footer-items">Android Video Player</p>
              </div>
            </div>
          </div>
          <div className="footer-item-copyright-1">
            <p
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                color: '#969696',
                marginTop: '15px',
              }}
            >
              Copyright © 2021 Veeplay
            </p>
          </div>
        </div>
        <div className="footer-divs">
          <p className="heading-h4" style={{ color: 'white' }}>
            Video guides
          </p>
          <p className="footer-items">Video Streaming</p>
        </div>
        <div className="footer-divs">
          <p className="heading-h4" style={{ color: 'white' }}>
            More
          </p>
          <div className="footer-div-more">
            <div>
              <p className="footer-items" style={{ color: '#62C6FF' }}>
                Home Page
              </p>
            </div>
            <div className="footer-item-github">
              <p className="footer-items">GitHub</p>
            </div>
          </div>
          <div className="footer-item-copyright-2">
            <p
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                color: '#969696',
                marginTop: '30px',
              }}
            >
              Copyright © 2021 Veeplay
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
