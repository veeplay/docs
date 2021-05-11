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
      <td>
        {versions.join(', ')}
      </td>
      <td width="50%" className="notes">
        {(
          data.profiles
        || data.level
        || data.max
        || data.containers
        || data.notes
        ) && [
          data.profiles && `Profiles: ${Array.isArray(data.profiles) ? data.profiles.join(', ') : data.profiles}`,
          data.level && `Up to level ${data.level}`,
          data.max && `Up to: ${Array.isArray(data.max) ? data.max.map((m) => `${m.res}@${m.fps}fps`).join(' or ') : `${data.max.res}@${data.max.fps}fps`}`,
          data.containers && `Containers: ${Array.isArray(data.containers) ? data.containers.join(', ') : data.containers}`,
          data.notes,
        ].filter((s) => !!s).map((s) => (
          <>
            {s}
            <br />
          </>
        ))}
      </td>
    </>
  );

  return (
    <>
      {['streaming-device', 'tv', 'handheld', 'browser'].map((type) => (
        <table className="support-matrix">
          <tr>
            <th colSpan={3} align="left">
              <strong>
                {familyName(type)}
                &nbsp;Native Support
              </strong>
            </th>
          </tr>
          {Object.keys(specs[type] || {}).map((family) => (
            <>
              <tr>
                <td className="device-family" rowSpan={specs[type][family].length}>
                  ☑&nbsp;
                  {family}
                </td>
                {details(specs[type][family][0].versions, specs[type][family][0].support[0])}
              </tr>
              {specs[type][family].slice(1).map(({ versions, support }) => (
                <tr>
                  {details(versions, support[0])}
                </tr>
              ))}
            </>
          ))}
        </table>
      ))}
    </>
  );
};
