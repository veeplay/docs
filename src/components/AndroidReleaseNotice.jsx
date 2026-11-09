/* eslint-disable import/no-unresolved */
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const PRE_RELEASE = /-(rc|beta|alpha)/i;

const describe = (version) => {
  const stage = (version.match(PRE_RELEASE) || [])[1].toLowerCase();
  const base = version.replace(/-.*$/, '');
  const name = { rc: 'a release candidate', beta: 'a beta', alpha: 'an alpha' }[stage];
  return `${name} of ${base}`;
};

export default function AndroidReleaseNotice() {
  const { siteConfig } = useDocusaurusContext();
  const version = siteConfig.customFields.androidSdkVersion;
  if (!PRE_RELEASE.test(version)) return null;
  return (
    <div className="admonition admonition-note alert alert--info">
      <div className="admonition-content">
        <p>
          The current version is
          {' '}
          <code>{version}</code>
          ,
          {' '}
          {describe(version)}
          . The coordinates on this page use this version. Once the final
          version is released, only the version number changes.
        </p>
      </div>
    </div>
  );
}
