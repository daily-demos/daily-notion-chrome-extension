import React from 'react';
import Card from './Card';
import ParticipantBar from './ParticipantBar';
import Controls from './Controls';
import theme from '../theme';

export default function Call() {
  return (
    <div className="call-container">
      <Card padding="8">
        <h1>Share Notion link to invite others</h1>
        <div className="call-contents">
          <ParticipantBar />
          <Controls />
        </div>
      </Card>
      <style jsx>{`
        .call-container {
          position: absolute;
          top: 0;
          right: 0px;
          z-index: 9999;
        }
        .call-container h1 {
          color: ${theme.colors.darkGrey};
          line-height: 14px;
          font-size: ${theme.fontSize.small};
          font-weight: 400;
          white-space: nowrap;
          margin-top: 0;
        }
        .call-contents {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
