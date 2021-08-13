import React from 'react';
import { useCallState } from '../contexts/CallProvider';
import PeopleIcon from '../icons/PeopleIcon';
import theme from '../theme';
import LightButton from './LightButton';
import { Loading } from './Loading';

const JOIN_BTN_WIDTH = 128;

export default function JoinCallButton() {
  const { createCallObject, isTranscribing, buttonLoading } = useCallState();
  return (
    <div className="join-button-container">
      <LightButton
        colorTheme="blue"
        color={theme.colors.darkGrey}
        onClick={createCallObject}
      >
        {buttonLoading ? (
          <span className="join-button">
            <Loading size={16} color={theme.colors.darkOrange} />
          </span>
        ) : (
          <>
            <span>Join live call</span>
            <PeopleIcon />
          </>
        )}
      </LightButton>
      {isTranscribing && (
        <p className="is-transcribing">Transcription in progress...</p>
      )}
      <style jsx>{`
        .join-button-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          max-width: ${JOIN_BTN_WIDTH}px;
        }
        .join-button-container .is-transcribing {
          font-size: ${theme.fontSize.small};
          color: ${theme.colors.blue};
          line-height: 14px;
          margin-top: 8px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
