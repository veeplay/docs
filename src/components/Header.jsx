import React, { useState } from 'react';

import './Header.css';
import docs from '../../sources/json/schema.json';

const extractConfigs = (name, descriptor, path) => {
  const configs = [];
  const currentPath = path ? `${path}.${name}` : 'root';
  if (name) {
    configs.push({
      name,
      title: descriptor.title,
      path: currentPath,
      platforms: descriptor.platforms || ['html', 'ios', 'android'],
    });
  }
  if (descriptor.properties) {
    return configs.concat(
      Object.entries(descriptor.properties).map(([configName, configDescriptor]) => extractConfigs(configName, configDescriptor, `${currentPath}.properties`)).reduce((a, v) => a.concat(v), []),
    );
  } if (descriptor.items && descriptor.items.properties) {
    return configs.concat(
      Object.entries(descriptor.items.properties).map(([configName, configDescriptor]) => extractConfigs(configName, configDescriptor, `${currentPath}.items.properties`)).reduce((a, v) => a.concat(v), []),
    );
  }

  return configs;
};
const allConfigs = extractConfigs(null, docs);

function Header({ expandPath, searchFilters: { showHtml, showIOS, showAndroid } }) {
  const [currentSearch, setCurrentSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  let matches = [];

  if (currentSearch) {
    const search = new RegExp(currentSearch, 'i');
    matches = allConfigs.filter((c) => ((c.name && c.name.match(search))
      || (c.title && c.title.match(search)))
      && (
        (!showHtml && !showIOS && !showAndroid)
        || (showHtml && c.platforms.includes('html'))
        || (showIOS && c.platforms.includes('ios'))
        || (showAndroid && c.platforms.includes('android'))
      ));
    if (matches.length === 0) {
      matches = [{ name: 'No results' }];
    }
  }

  return (
    <header>
      <div className="search">
        <input
          className="searchInput"
          placeholder="Search configs"
          value={currentSearch}
          onChange={(event) => setCurrentSearch(event.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 100)}
        />
        <div className="searchButton" />
        {searchFocused && currentSearch && (
          <div className="autocompleteContainer">
            {matches.map((m) => (
              <div
                key={m.path || m.name}
                className="autocompleteOption"
                onClick={() => {
                  if (m.path) {
                    expandPath(m.path);
                    setCurrentSearch(m.name);
                  }
                }}
              >
                {
                  m.path && m.path
                    .split('.')
                    .slice(1, -1)
                    .filter((c) => !['properties', 'items'].includes(c))
                    .concat(<span key={m.path} className="autocompleteOptionName">{m.name}</span>)
                    .reduce((a, e) => a.concat([e, ' ⟩ ']), [])
                    .slice(0, -1)
                }
                {!m.path && 'No results'}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
