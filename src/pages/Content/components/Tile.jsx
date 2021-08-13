import React, { useRef, useEffect, useMemo } from 'react';
import theme from '../theme';
import { useCallState } from '../contexts/CallProvider';
import MicIcon from '../icons/MicIcon';
import MicMutedIcon from '../icons/MicMutedIcon';

const DEFAULT_TILE_HEIGHT = 66;

export default function Tile({
  participant: { videoTrack, audioTrack, audio, local, session_id, user_name },
  tileHeight = DEFAULT_TILE_HEIGHT,
  tileWidth = DEFAULT_TILE_HEIGHT,
}) {
  const { callType, activeSpeakerPeerId } = useCallState();
  const videoEl = useRef(null);
  const audioEl = useRef(null);

  /**
   * Set the video element's source
   */
  useEffect(() => {
    if (!videoEl.current || !videoTrack) return;

    videoEl.current.srcObject = new MediaStream([videoTrack]);
  }, [videoEl, videoTrack]);

  /**
   * Set the audio element's source
   */
  useEffect(() => {
    if (!audioEl.current || !audioTrack || local) return;
    audioEl.current.srcObject = new MediaStream([audioTrack]);
  }, [audioEl, audioTrack]);

  const micIconColor = useMemo(
    () =>
      !videoTrack || callType === 'audio'
        ? theme.colors.darkGrey
        : theme.colors.white,
    [videoTrack, callType]
  );

  return (
    <div className="tile-container">
      <audio autoPlay playsInline ref={audioEl} />
      <div className="audioIcon">
        {user_name && <span className="username">{user_name}</span>}
        {audio ? (
          <MicIcon color={micIconColor} />
        ) : (
          <MicMutedIcon color={micIconColor} />
        )}
      </div>
      {!videoTrack || callType === 'audio' ? (
        <div className="no-video"></div>
      ) : (
        <video autoPlay muted playsInline ref={videoEl} />
      )}

      <style jsx>{`
        .tile-container {
          position: relative;
          margin-right: 4px;
          height: ${tileHeight}px;
        }
        video {
          width: ${tileWidth}px;
          height: ${tileHeight}px;
          object-fit: cover;
          border-radius: 3px;
          background-color: ${theme.colors.lightestGrey};
          border: 2px solid
            ${activeSpeakerPeerId === session_id && audio
              ? theme.colors.green
              : theme.colors.lightGrey};
        }
        .no-video {
          height: ${tileHeight}px;
          width: ${tileWidth}px;
          border-radius: 3px;
          background-color: ${theme.colors.lightestGrey};
          border: 2px solid
            ${activeSpeakerPeerId === session_id
              ? theme.colors.green
              : theme.colors.lightGrey};
        }
        .audioIcon {
          position: absolute;
          bottom: 0;
          right: 0;
          display: flex;
        }
        .audioIcon .username {
          color: ${!videoTrack || callType === 'audio'
            ? theme.colors.darkGrey
            : theme.colors.white};
          font-size: ${theme.fontSize.small};
          font-weight: 600;
          width: 40px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
