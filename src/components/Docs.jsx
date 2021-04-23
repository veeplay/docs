import React, { useState, useEffect } from 'react';
import {
  get, set, cloneDeep, isEqual,
} from 'lodash';
import { scroller } from 'react-scroll';

import Config from './Config';

import docs from '../../sources/json/schema.json';
import './Docs.css';

function Docs({ expandedPath, setSearchFilters }) {
  const urlPath = (global.window && window.location.hash) ? window.location.hash.replace('#', '') : undefined;
  const defaultExpandedPaths = {
    root: {
      properties: {
        content: {
          items: true,
        },
        ads: true,
      },
    },
  };
  const [pathsOpen, setPathsOpen] = useState(defaultExpandedPaths);
  const [showHtml, setShowHtml] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [showAndroid, setShowAndroid] = useState(false);
  const pathToExpand = expandedPath || urlPath;

  useEffect(() => {
    if (pathToExpand) {
      const modifiedPathsOpen = cloneDeep(pathsOpen);
      set(modifiedPathsOpen, pathToExpand, true);
      if (!isEqual(pathsOpen, modifiedPathsOpen)) {
        setPathsOpen(modifiedPathsOpen);
      }
      setTimeout(() => {
        scroller.scrollTo(pathToExpand, {
          duration: 700,
          smooth: true,
          offset: -150,
        });
      }, 200);
    }
  }, [pathToExpand]);

  return (
    <div>
      <div className="detailsHeaders">
        <div className="docsSmallHeader">
          Documentation
        </div>
        <div className="docsLargeHeader">
          Player JSON Configuration
        </div>
      </div>
      <div className="detailsBar">
        <div className="optionsLabel">
          Show options for:
        </div>
        <div
          className={`docsPlatformButton docsPlatformHtml ${showHtml ? 'selected' : ''}`}
          onClick={() => {
            setSearchFilters({ showHtml: !showHtml, showIOS, showAndroid });
            setShowHtml(!showHtml);
          }}
        />
        <div
          className={`docsPlatformButton docsPlatformIos ${showIOS ? 'selected' : ''}`}
          onClick={() => {
            setSearchFilters({ showHtml, showIOS: !showIOS, showAndroid });
            setShowIOS(!showIOS);
          }}
        />
        <div
          className={`docsPlatformButton docsPlatformAndroid ${showAndroid ? 'selected' : ''}`}
          onClick={() => {
            setSearchFilters({ showHtml, showIOS, showAndroid: !showAndroid });
            setShowAndroid(!showAndroid);
          }}
        />
      </div>
      <div className="jsonContainer">
        <Config
          descriptor={docs}
          pathsOpen={pathsOpen}
          expandedPath={pathToExpand}
          onTap={(path) => {
            const modifiedPathsOpen = cloneDeep(pathsOpen);
            const currentlyOpen = !!get(pathsOpen, path);
            set(modifiedPathsOpen, path, !currentlyOpen);
            setPathsOpen(modifiedPathsOpen);
          }}
          filters={{ showHtml, showIOS, showAndroid }}
        />
      </div>
    </div>
  );
}

export default Docs;
