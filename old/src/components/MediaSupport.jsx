import React from 'react';
import MediaSupport from '../../media-support';

export default ({ features = [], families = [] }) => {
  const ms = MediaSupport();
  const specs = ms.for(features).on(families).byDevice();
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
  const details = (versions, datas) => (
    <>
      <td>
        {versions.join(', ')}
      </td>
      <td width="50%" className="notes">
        {datas.map((data) => (
          <div>
            ☑&nbsp;
            <strong>{ms.feature(data.type).name}</strong>
            <br />
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
                -&nbsp;
                {s}
                <br />
              </>
            ))}
          </div>
        ))}
      </td>
    </>
  );

  return (
    <>
      {['streaming-device', 'tv', 'handheld', 'browser'].map((type) => {
        if (Object.keys(specs[type] || {}).length === 0) {
          return (<></>);
        }
        return (
          <table className="support-matrix">
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '25%' }} />
              <col />
            </colgroup>
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
                  {details(specs[type][family][0].versions, specs[type][family][0].support)}
                </tr>
                {specs[type][family].slice(1).map(({ versions, support }) => (
                  <tr>
                    {details(versions, support)}
                  </tr>
                ))}
              </>
            ))}
          </table>
        );
      })}
    </>
  );
};
