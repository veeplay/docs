/* eslint-disable react/no-danger */

import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import Layout from '@theme/Layout';

import loadScript from './loadScript';

export default (htmlContent) => () => {
  useEffect(() => {
    loadScript('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js', () => {
      loadScript('pagelocation', '/scripts/jssdk/pagelocation.js');
      loadScript('collapsible', '/scripts/jssdk/collapsible.js');
      loadScript('scrollbar', '/scripts/jssdk/scrollbar.js', () => {
        $('#menu-container').scrollbar();
      });
      loadScript('selectric', '/scripts/jssdk/jquery.selectric.min.js');
    });
    loadScript('linenumber', '/scripts/jssdk/linenumber.js');
    loadScript('clipboard', '/scripts/jssdk/clipboard.min.js');
  }, []);
  return (
    <Layout noFooter>
      <div
        id="js-sdk-content"
        dangerouslySetInnerHTML={{
          __html: htmlContent
            .replace('<nav>', '<div id="jsdoc-nav">')
            .replace('</nav>', '</div>'),
        }}
      />

      <link id="google-font" href="https://fonts.googleapis.com/css?family=Roboto+Mono|Cutive+Mono|Roboto:300,400,700" rel="stylesheet" />
      <link type="text/css" rel="stylesheet" href="/css/jssdk/jsdoc-default.css" />
      <link type="text/css" rel="stylesheet" href="/css/jssdk/collapsible.css" />
      <link type="text/css" rel="stylesheet" href="/css/jssdk/selectric.css" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossOrigin="anonymous" />
    </Layout>
  );
};
