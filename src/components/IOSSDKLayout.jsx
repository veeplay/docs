/* eslint-disable react/no-danger */

import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import Layout from '@theme/Layout';

import loadScript from './loadScript';

export default (htmlContent) => () => {
  useEffect(() => {
    loadScript('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js', () => {
      loadScript('jazzy', '/scripts/iossdk/jazzy.js');
    });
  }, []);
  return (
    <Layout>
      <div
        id="ios-sdk-content"
        dangerouslySetInnerHTML={{
          __html: htmlContent
            .replace('src="img/', 'src="/img/iossdk/')
            .replaceAll(/<a class="nav-group-name-link" href="(.*)">/ig, (match, p1) => `<a class="nav-group-name-link" href="${p1.replaceAll('%20', '_')}">`)
            .replaceAll(/<a class="nav-group-task-link" href="(.*)">(.*)<\/a>/ig, (match, p1, p2) => `<a class="nav-group-task-link" title="${p2}" href="${p1.replaceAll('%20', '_')}">${p2.length > 22 ? `${p2.substring(0, 22)}...` : p2}</a>`),
        }}
      />
      <link rel="stylesheet" type="text/css" href="/css/iossdk/jazzy.css" />
      <link rel="stylesheet" type="text/css" href="/css/iossdk/highlight.css" />
    </Layout>
  );
};
