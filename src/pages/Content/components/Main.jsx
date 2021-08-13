import React, { useCallback, useEffect, useMemo } from 'react';
import { useCallState } from '../contexts/CallProvider';
import theme from '../theme';
import Call from './Call';
import LightButton from './LightButton';
import { Loading } from './Loading';
import Setup from './Setup';
import Haircheck from './Haircheck';
import JoinCallButton from './JoinCallButton';
import StartCallButton from './StartCallButton';
import Authorization from './Authorization';
import Card from './Card';

export default function Main() {
  const {
    callState,
    setCallState,
    daily,
    dailyUrl,
    messageReceived,
    setParticipants,
    backgroundError,
    authError,
    setBackgroundError,
    setAuthError,
    setButtonLoading,
    leaveCall,
  } = useCallState();

  const close = useCallback(() => {
    const leave = async () => {
      await daily.leave();
      daily.destroy();
    };
    if (daily) {
      leave();
      setButtonLoading(false);
    }
    setBackgroundError(null);
    setAuthError(null);
    setCallState('idle');
    setButtonLoading(false);
  }, [daily, setCallState]);

  // if the Daily call object exists (triggered by createCallObject), go to the haircheck to join call
  useEffect(() => {
    if (!daily || !dailyUrl) return;
    if (daily.meetingState() === 'joined-meeting') {
      /**
       * if the meeting is already joined, this indicates a tab change.
       * for now, just exit the call.
       */
      leaveCall();
      return;
    }
    const setup = async () => {
      await daily.preAuth({ url: dailyUrl });
      await daily.startCamera();
      setParticipants(Object.values(daily.participants()));
      setCallState('haircheck');
    };
    setup();
  }, [daily, dailyUrl]);

  const mainContent = useMemo(() => {
    if (!messageReceived) {
      return <Loading />;
    }
    if (callState === 'idle') {
      return (
        <div className="authorized-container">
          <Authorization />
          {dailyUrl ? <JoinCallButton /> : <StartCallButton />}
          <style jsx>{`
            .authorized-container {
              display: flex;
            }
          `}</style>
        </div>
      );
    }
    return (
      <>
        {callState !== 'joined' && (
          <LightButton onClick={close}>
            <span>Close</span>
          </LightButton>
        )}
        {callState === 'setup' && <Setup />}
        {callState === 'haircheck' && <Haircheck />}
        {callState === 'joined' && <Call />}
      </>
    );
  }, [callState, messageReceived, dailyUrl, close]);

  return (
    <div className="main-container">
      {mainContent}
      {(backgroundError || authError) && (
        <div className="error-container">
          <Card
            padding={4}
            borderColor={theme.colors.red}
            background={theme.colors.lightRed}
          >
            <p className="background-error">{authError}</p>
            <p className="background-error">{backgroundError}</p>
          </Card>
        </div>
      )}
      <style jsx global>{`
        .background-error {
          font-size: ${theme.fontSize.small};
          margin: 0;
        }
        svg {
          display: block;
          margin: auto;
        }
      `}</style>
      <style jsx>{`
        .main-container {
          position: absolute;
          top: 48px;
          right: 16px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .main-container :global(.join-button) {
          width: 102px;
          height: 16px;
          display: flex;
          justify-content: center;
        }
        .main-container :global(.light-btn-container .join-button svg) {
          margin-left: auto;
        }
        .main-container .error-container {
          position: absolute;
          top: -32px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
