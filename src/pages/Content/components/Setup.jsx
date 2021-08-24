import React, { useCallback, useEffect, useRef, useState } from 'react';
import theme from '../theme';
import Card from './Card';
import BlueButton from './BlueButton';
import { useCallState } from '../contexts/CallProvider';
import { Loading } from './Loading';
import RadioButton from './RadioButton';

/**
 * Send message to background script to create a new Daily call
 */
const createCallFromBackground = (
  audioOnly = false,
  useTranscription = false,
  workspaceId
) => {
  chrome.runtime.sendMessage(
    { createCall: true, audioOnly, useTranscription, workspaceId },
    (res) => console.log(res)
  );
};

export default function Setup() {
  const transcriptionRef = useRef(null);
  const {
    setCallType,
    setUseTranscription,
    dailyUrl,
    createCallObject,
    workspaceId,
    buttonLoading,
    setButtonLoading,
    workspaceValid,
  } = useCallState();
  const [type, setType] = useState('video');

  // Update call type selection when radio button selection changes
  const onChangeType = (e) => {
    const type = e.target.value === 'radio-button-1' ? 'audio' : 'video';
    setType(type);
  };

  /**
   * The actual POST to create a call happens in the background script, so this action sends that request
   */
  const requestDailyCall = useCallback(() => {
    if (!transcriptionRef?.current) return;
    const useTranscription = !!transcriptionRef.current.checked;
    // joinCall in Haircheck handles removing the spinner
    setButtonLoading(true);
    setCallType(type);
    createCallFromBackground(type === 'audio', useTranscription, workspaceId); // video call by default
    setUseTranscription(useTranscription);
  }, [transcriptionRef, type, workspaceId]);

  /**
   * Once the Daily room has been created by the background script after clicking
   * the “Create call” button, the dailyUrl is set and the call object can be created.
   * The user will then be redirected to the haircheck.
   */
  useEffect(() => {
    if (!dailyUrl) return;
    createCallObject();
  }, [dailyUrl]);

  return (
    <div className="setup-container">
      <Card>
        <h1>Start live call</h1>
        <p>Choose how participants join the call.</p>

        <RadioButton
          onChange={onChangeType}
          option1Text="Audio-only"
          option2Text="Video call"
          defaultChecked={type === 'audio' ? 1 : 2}
        />

        <div className="transcription-switch">
          <label htmlFor="transcription">
            {workspaceValid
              ? 'Transcribe call and add to Notion doc'
              : 'Authorize your workspace to transcribe calls'}
          </label>
          <label className="switch">
            <input
              ref={transcriptionRef}
              id="transcription"
              type="checkbox"
              disabled={!workspaceValid}
            />
            <span
              className={`slider round ${workspaceValid ? '' : 'disabled'}`}
            ></span>
          </label>
        </div>

        <BlueButton onClick={requestDailyCall}>
          {buttonLoading ? (
            <Loading size={16} color={theme.colors.white} />
          ) : (
            'Create call'
          )}
        </BlueButton>
      </Card>
      <style jsx>{`
        .setup-container {
          margin-top: 8px;
        }
        .setup-container h1 {
          color: ${theme.colors.darkOrange};
          line-height: 17px;
          font-size: ${theme.fontSize.base};
          margin-top: 0;
        }
        .setup-container p {
          color: ${theme.colors.darkGrey};
          line-height: 14px;
          font-size: ${theme.fontSize.small};
        }

        .transcription-switch {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 16px 0;
        }
        .transcription-switch label {
          font-size: ${theme.fontSize.small};
          color: ${theme.colors.darkGrey};
          margin-right: 6px;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 26px;
          height: 16px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${theme.colors.lightGrey};
          -webkit-transition: 0.4s;
          transition: 0.4s;
        }

        .slider:before {
          position: absolute;
          content: '';
          height: 12px;
          width: 12px;
          left: 2px;
          bottom: 2px;
          background-color: ${theme.colors.white};
          -webkit-transition: 0.4s;
          transition: 0.4s;
        }
        .slider.disabled:before {
          background-color: ${theme.colors.medGrey};
        }

        input:checked + .slider {
          background-color: ${theme.colors.blue};
        }

        input:focus + .slider {
          box-shadow: 0 0 1px ${theme.colors.blue};
        }

        input:checked + .slider:before {
          -webkit-transform: translateX(10px);
          -ms-transform: translateX(10px);
          transform: translateX(10px);
        }

        .slider.round {
          border-radius: 16px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
