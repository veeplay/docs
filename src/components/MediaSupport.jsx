import React from 'react';
import MediaSupport from '../../media-support';

export default ({ features }) => {
  const ms = MediaSupport();
  const specs = ms.for(features).byDevice();
  const familyName = (family) => {
    if (family === 'streaming-device') {
      return 'Device';
    }
    if (family === 'tv') {
      return 'TV';
    }
    if (family === 'handheld') {
      return 'Phone/Tablet';
    }
    return 'Browser';
  };
  const details = (versions, data) => (
    <>
      {versions.join(', ')}
      {(
        data.profiles
        || data.level
        || data.max
        || data.containers
        || data.notes
      ) && (
        <em>
          &nbsp;(
            {
              [
                data.profiles && `Profiles: ${Array.isArray(data.profiles) ? data.profiles.join(', ') : data.profiles}`,
                data.level && `Up to level ${data.level}`,
                data.max && `Up to: ${Array.isArray(data.max) ? data.max.map((m) => `${m.res}@${m.fps}fps`).join(' or ') : `${data.max.res}@${data.max.fps}fps`}`,
                data.containers && `Containers: ${Array.isArray(data.containers) ? data.containers.join(', ') : data.containers}`,
                data.notes,
              ].filter((s) => !!s).join('; ')
            }
          )
        </em>
      )}
    </>
  );

  return (
    <ul>
      {['streaming-device', 'tv', 'handheld', 'browser'].map((type) => (
        <li>
          <strong>
            {familyName(type)}
            &nbsp;Support:
          </strong>
          <ul>
            {Object.keys(specs[type] || {}).map((family) => (
              <li>
                ☑&nbsp;
                {family}
                &nbsp;
                {specs[type][family].length === 1 && (
                  details(specs[type][family][0].versions, specs[type][family][0].support[0])
                )}
                {specs[type][family].length > 1 && (
                  <ul>
                    {specs[type][family].map(({ versions, support }) => (
                      <li>
                        {details(versions, support[0])}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
