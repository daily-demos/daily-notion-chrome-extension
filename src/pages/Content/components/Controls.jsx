import React, { useCallback, useEffect, useState } from 'react';
import theme from '../theme';
import LightButton from './LightButton';
import MicIcon from '../icons/MicIcon';
import CamMutedIcon from '../icons/CamMutedIcon';
import SettingsIcon from '../icons/SettingsIcon';
import LeaveIcon from '../icons/LeaveIcon';
import Settings from './Settings';
import { useCallState } from '../contexts/CallProvider';
import MicMutedIcon from '../icons/MicMutedIcon';
import CamIcon from '../icons/CamIcon';

// Update the call item to have transcription on
const turnOnTranscribingStatus = (workspaceId) => {
  chrome.runtime.sendMessage({ startTranscription: true, workspaceId }, (res) =>
    console.log(res)
  );
};
/**
 * We store the transcribing status on the doc call item so people
 * can know if transcription is in progress before joining the call.
 * This will PATCH the item to set transcribing to false (called from
 * background script).
 */
const turnOffTranscribingStatus = (workspaceId) => {
  chrome.runtime.sendMessage(
    { endTranscribingStatus: true, workspaceId },
    (res) => console.log(res)
  );
};

export default function Controls() {
  const {
    leaveCall,
    isTranscribing,
    setIsTranscribing,
    useTranscription,
    daily,
    callType,
    workspaceId,
    workspaceValid,
  } = useCallState();
  const [showSettings, setShowSettings] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camMuted, setCamMuted] = useState(false);

  /**
   * Set initial state for mic and camera, which will depend
   * on the room's settings.
   */
  useEffect(() => {
    if (!daily) return;
    setMicMuted(!daily.localAudio());
    setCamMuted(!daily.localVideo());
  }, [daily]);

  // Turn transcription on for a live call
  const startTranscription = useCallback(() => {
    const startTrackForwarding = async () => {
      /**
       *
       * betaStartTrackForwarding is a method currently under development.
       * DO NOT use it in production apps. All related functionality will
       * be exposed in daily-js in due time :)
       *
       */
      console.log('STARTING TRANSCRIPTION REQUESTED');
      await window?.betaStartTrackForwarding({ deepgram: true });
      console.log('TRANSCRIPTION REQUESTED');
    };
    setIsTranscribing(true);
    turnOnTranscribingStatus(workspaceId);

    startTrackForwarding();
  }, [workspaceId]);

  // Turn transcription off for a live call
  const stopTranscription = useCallback(() => {
    const stopTrackForwarding = async () => {
      /**
       *
       * betaStopTrackForwarding is a method currently under development.
       * DO NOT use it in production apps. All related functionality will
       * be exposed in daily-js in due time :)
       *
       */
      await window?.betaStopTrackForwarding();
    };
    setIsTranscribing(false);
    turnOffTranscribingStatus(workspaceId);
    stopTrackForwarding();
  }, [workspaceId]);

  const handleLeaveCall = () => leaveCall();

  // Show settings menu for device selection
  const handleSettingsClick = useCallback(() => {
    setShowSettings(!showSettings);
  }, [showSettings]);

  // Mute local audio
  const handleMute = useCallback(() => {
    daily.setLocalAudio(!daily.localAudio());
    setMicMuted(daily.localAudio());
  }, [daily]);

  // Mute local video
  const handleCamMute = useCallback(() => {
    daily.setLocalVideo(!daily.localVideo());
    setCamMuted(daily.localVideo());
  }, [daily]);

  return (
    <div
      className="controls-container"
      style={useTranscription ? {} : { maxWidth: 72 }}
    >
      <div className="transcription">
        {useTranscription &&
          (!isTranscribing ? (
            <LightButton
              className="transcription-button"
              colorTheme="blue"
              onClick={startTranscription}
              disabled={!workspaceValid}
            >
              Start transcription
            </LightButton>
          ) : (
            <LightButton
              onClick={stopTranscription}
              textColor={theme.colors.orange}
              disabled={!workspaceValid}
            >
              Stop transcription
            </LightButton>
          ))}
      </div>
      <div
        className="control-buttons"
        style={{ flexWrap: useTranscription ? 'nowrap' : 'wrap' }}
      >
        <button className="control-button" onClick={handleMute}>
          {micMuted ? <MicMutedIcon /> : <MicIcon />}
        </button>
        {callType === 'video' && (
          <button className="control-button" onClick={handleCamMute}>
            {camMuted ? <CamMutedIcon /> : <CamIcon />}
          </button>
        )}
        <button className="control-button" onClick={handleSettingsClick}>
          <SettingsIcon />
        </button>
        <button className="control-button" onClick={handleLeaveCall}>
          <LeaveIcon />
        </button>
      </div>
      {showSettings && <Settings />}
      <style jsx>{`
        .controls-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .control-buttons {
          display: flex;
          border: 1px solid ${theme.colors.lightGrey};
          border-radius: 3px;
        }
        .control-button {
          background-color: ${theme.colors.white};
          padding: 7px 5px;
          border-radius: 0;
          border: 1px solid ${theme.colors.lightGrey};
          flex: 1;
        }
        .transcription {
          width: 136px;
        }
      `}</style>
    </div>
  );
}
