/* eslint-disable import/no-unresolved */
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <div className={styles.features}>
        <div className={styles.feature}>
          <h2>
            <i className="fas fa-file-video" />
            Video API
          </h2>
          <ul>
            <li><a href="/video-api/#section/Introduction">Introduction</a></li>
            <li><a href="/video-api/#section/Supported-Inputs">Supported inputs</a></li>
            <li><a href="/video-api/#section/Smart-Adaptive-Output">Smart adaptive output</a></li>
          </ul>
        </div>
        <div className={styles.feature}>
          <h2>
            <i className="fas fa-ad" />
            Server-Side Ad Insertion
          </h2>
          <ul>
            <li><a href="/docs/ssai/index">Introduction</a></li>
            <li><a href="/docs/ssai/ad-tracking">Ad tracking &amp; reporting</a></li>
            <li><a href="/docs/ssai/manifest-dash">DASH support</a></li>
            <li><a href="/docs/ssai/manifest-hls">HLS support</a></li>
          </ul>
        </div>
        <div className={styles.feature}>
          <h2>
            <i className="fab fa-js" />
            JavaScript Player SDK
          </h2>
          <ul>
            <li><a href="/javascript-player/">Introduction</a></li>
            <li><a href="/javascript-player/#using-with-react">Using with React</a></li>
            <li><a href="/javascript-player/MediaPlayer.html">Player class reference</a></li>
            <li><a href="/javascript-player/MediaBuilder.html">Builder class reference</a></li>
          </ul>
        </div>
        <div className={styles.feature}>
          <h2>
            <i className="fab fa-apple" />
            iOS Player SDK
          </h2>
          <ul>
            <li><a href="/ios-player/readme.html">Introduction</a></li>
            <li><a href="/ios-player/Classes/APSMediaPlayer.html">Player class reference</a></li>
            <li><a href="/ios-player/Classes/APSMediaBuilder.html">Builder class reference</a></li>
          </ul>
        </div>
        <div className={styles.feature}>
          <h2>
            <i className="fab fa-android" />
            Android Player SDK
          </h2>
          <ul>
            <li><a href="/android-player/">Class reference</a></li>
          </ul>
        </div>
        <div className={styles.feature}>
          <h2>
            <i className="fas fa-cogs" />
            JSON Player Configuration
          </h2>
          <ul>
            <li><a href="/json-configuration/">JSON reference</a></li>
          </ul>
        </div>
        <div className={styles.feature}>
          <h2>
            <i className="fas fa-graduation-cap" />
            Web Video Guides
          </h2>
          <ul>
            <li><a href="/docs/video-guides/how-video-streaming-works">How Video Streaming Works</a></li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
