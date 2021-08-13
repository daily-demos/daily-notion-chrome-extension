import React from 'react';
import { useCallState } from '../contexts/CallProvider';
import theme from '../theme';

export default function SettingsOptions() {
  const {
    audioInput,
    audioOutput,
    videoInput,
    callType,
    daily,
  } = useCallState();

  /**
   * Update the local participant's audio input selection
   */
  const updateMic = (e) => {
    daily.setInputDevicesAsync({ audioDeviceId: e.target.value });
  };
  /**
   * Update the local participant's audio output selection
   */
  const updateSpeaker = (e) => {
    daily.setOutputDevice({ audioDeviceId: e.target.value });
  };
  /**
   * Update the local participant's video input selection
   */
  const updateVideo = (e) => {
    daily.setInputDevicesAsync({ videoDeviceId: e.target.value });
  };

  return (
    <div className="settings-options">
      <label htmlFor="micOptions">Mic:</label>
      <select name="micOptions" id="micSelect" onChange={updateMic}>
        {audioInput.map((d) => (
          <option
            key={`mic-${d.deviceId}`}
            value={d.deviceId}
            defaultValue={d.deviceId === 'default'}
          >
            {d.label}
          </option>
        ))}
      </select>
      <label htmlFor="speakerOptions">Speaker:</label>
      <select name="speakerOptions" id="speakerSelect" onChange={updateSpeaker}>
        {audioOutput.map((d) => (
          <option
            key={`speaker-${d.deviceId}`}
            value={d.deviceId}
            defaultValue={d.deviceId === 'default'}
          >
            {d.label}
          </option>
        ))}
      </select>
      {callType === 'video' && (
        <>
          <label htmlFor="videoOptions">Camera:</label>
          <select name="videoOptions" id="videoSelect" onChange={updateVideo}>
            {videoInput.map((d) => (
              <option
                key={`video-${d.deviceId}`}
                value={d.deviceId}
                defaultValue={d.deviceId === 'default'}
              >
                {d.label}
              </option>
            ))}
          </select>
        </>
      )}
      <style jsx>{`
        label {
          display: block;
          color: ${theme.colors.darkGrey};
          font-size: ${theme.fontSize.small};
          margin: 9px 0;
          line-height: 14px;
        }
        select {
          border: 1px solid ${theme.colors.medGrey};
          font-size: ${theme.fontSize.base};
          padding: 8px 8px 7px 4px;
          color: ${theme.colors.darkOrange};
          width: 266px;
        }
        option:selected {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 254px;
        }
      `}</style>
    </div>
  );
}
