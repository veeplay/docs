import React, { useState } from 'react';
import { get } from 'lodash';
import { Element } from 'react-scroll';
import copy from 'copy-to-clipboard';

const TYPE_COLOR_MAPPING = {
  array: 'purple',
  object: 'purple',
  integer: 'yellow',
  number: 'yellow',
  boolean: 'blue',
  string: 'green',
};

const TYPE_BRACKETS = {
  array: {
    start: ' : [',
    end: ']',
    closed: ' : [ ... ]',
  },
  object: {
    start: ' : {',
    end: '}',
    closed: ' : { ... }',
  },
  'when using overlay type': {
    start: ' ≫',
    end: '',
    closed: ' ≫',
  },
  default: {
    start: '',
    end: ',',
    closed: ',',
  },
};

function Config({
  name,
  descriptor,
  path = '',
  onTap,
  pathsOpen,
  skipHeader = false,
  expandedPath,
  filters,
}) {
  const currentPath = path ? `${path}.${name}` : 'root';
  const isOpen = !!get(pathsOpen, currentPath) || (
    name === 'items' && descriptor.type === 'object'
  );
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);
  let shouldRender = false;
  const platforms = descriptor.platforms || ['html', 'ios', 'android'];

  if (!filters.showHtml && !filters.showIOS && !filters.showAndroid) {
    shouldRender = true;
  } else if (
    (filters.showHtml && platforms.includes('html'))
    || (filters.showIOS && platforms.includes('ios'))
    || (filters.showAndroid && platforms.includes('android'))
  ) {
    shouldRender = true;
  }

  if (!shouldRender) {
    return (<div />);
  }

  return (
    <Element name={currentPath} className={expandedPath === currentPath ? 'highlighted' : ''}>
      <div className="title" onClick={() => onTap(currentPath)}>
        <div className={TYPE_COLOR_MAPPING[descriptor.type]}>{descriptor.type}</div>
        &nbsp;
        <div className="bold">
          {name}
          {(TYPE_BRACKETS[descriptor.type] || TYPE_BRACKETS.default)[isOpen ? 'start' : 'closed']}
        </div>
        <div
          className="anchor"
          onClick={(event) => {
            event.stopPropagation();
            copy(`https://docs.veeplay.com/json-configuration/#${currentPath}`);
            setShowCopyConfirmation(true);
            setTimeout(() => setShowCopyConfirmation(false), 2000);
          }}
        >
          {showCopyConfirmation && (
            <div className="copyConfirmation">
              Link Copied
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <div>
          <div className="dottedBorderLeft">
            {name && !skipHeader && !descriptor.skipHeader && (
              <div>
                <div className="separator" />
                {descriptor.title.split('\n').map((item) => (
                  <div key={item} className="description">
                    &#47;&#47;&nbsp;
                    {item}
                  </div>
                ))}
                <div className="description availability">
                  <div>
                    &#47;&#47;
                    available on:
                  </div>
                  {platforms.includes('html') && <div className="htmlIcon" />}
                  {platforms.includes('ios') && <div className="iosIcon" />}
                  {platforms.includes('android') && <div className="androidIcon" />}
                </div>
                <div className="description">
                  &#47;&#47;&nbsp;
                  <span className="brown">{descriptor.optional ? 'optional' : 'required'}</span>
                </div>
                {descriptor.enum && (
                  <div className="description">
                    &#47;&#47;
                    possible values:
                    &nbsp;
                    <span className="green">{descriptor.enum.map((v) => `"${v}"`).join(', ')}</span>
                  </div>
                )}
                {descriptor.default && (
                  <div className="description">
                    &#47;&#47;
                    default:
                    &nbsp;
                    <span className="green">
                      {
                      // eslint-disable-next-line no-nested-ternary
                      (typeof descriptor.default === 'boolean')
                        ? (descriptor.default ? 'true' : 'false')
                        : descriptor.default
                    }
                    </span>
                  </div>
                )}
                <div className="separator" />
              </div>
            )}
            {descriptor.properties && Object.keys(descriptor.properties).map((propName) => (
              <Config
                key={propName}
                name={propName}
                descriptor={descriptor.properties[propName]}
                path={`${currentPath}.properties`}
                onTap={onTap}
                pathsOpen={pathsOpen}
                expandedPath={expandedPath}
                filters={filters}
              />
            ))}
            {descriptor.items && (
              <Config
                name="items"
                descriptor={descriptor.items}
                path={currentPath}
                onTap={onTap}
                pathsOpen={pathsOpen}
                skipHeader
                expandedPath={expandedPath}
                filters={filters}
              />
            )}
          </div>
          <span className="bold">
            {(TYPE_BRACKETS[descriptor.type] || TYPE_BRACKETS.default).end}
          </span>
        </div>
      )}
    </Element>
  );
}

export default Config;
