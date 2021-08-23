import React from 'react';
import { useCallState } from '../contexts/CallProvider';
import LightButton from './LightButton';
import MicIcon from '../icons/MicIconBlue';

export default function StartCallButton() {
  const { setCallState } = useCallState();

  /**
   * The Daily call will actually be created and joined from
   * the Haircheck (prejoin UI), so bring the local user to the
   * Haircheck view for device selections.
   */
  const startSetup = () => {
    setCallState('setup');
  };

  return (
    <LightButton onClick={startSetup}>
      <>
        <span>Start live call</span>
        <MicIcon />
      </>
    </LightButton>
  );
}
