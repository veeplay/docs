/* eslint-disable import/no-unresolved */
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function AndroidReleaseNotice() {
  const { siteConfig } = useDocusaurusContext();
  const version = siteConfig.customFields.androidSdkVersion;
  if (!/-(rc|beta|alpha)/i.test(version)) return null;
  return (
    <div className="admonition admonition-note alert alert--info">
      <div className="admonition-content">
        <p>
          The current version is
          {' '}
          <code>{version}</code>
          , a release candidate of 3.2.0. The coordinates on this page use this
          version. Once 3.2.0 is released, only the version number changes.
        </p>
      </div>
    </div>
  );
}
