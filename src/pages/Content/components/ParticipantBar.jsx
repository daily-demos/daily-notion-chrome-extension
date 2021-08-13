import React, { useMemo } from 'react';
import { useCallState } from '../contexts/CallProvider';
import useWindowDimensions from '../hooks/useWindowDimensions';
import Tile from './Tile';

const CONTROLS_WIDTH = 136;
const PADDING_TOTAL_WIDTH = 40;

export default function ParticipantBar() {
  const { participants } = useCallState();
  const { width } = useWindowDimensions();

  if (!participants) return null;

  const bar = useMemo(() => {
    return (
      <div className="participant-bar-container">
        {(participants || []).map((p, i) => (
          <Tile key={i} participant={p} />
        ))}
        <style jsx>{`
          .participant-bar-container {
            display: flex;
            max-width: ${width - CONTROLS_WIDTH - PADDING_TOTAL_WIDTH}px;
            overflow-x: scroll;
          }
        `}</style>
      </div>
    );
  }, [participants, width]);
  return bar;
}
