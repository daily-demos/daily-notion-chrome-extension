import React, { useState } from 'react';
import Card from './Card';
import theme from '../theme';
import SettingsOptions from './SettingsOptions';

export default function Settings() {
  const { useTranscription } = useState();
  return (
    <div className="settings-container">
      <Card>
        <h1>Setup your hardware</h1>
        <SettingsOptions />
      </Card>
      <style jsx>{`
        .settings-container {
          position: absolute;
          top: ${useTranscription ? 108 : 116}px;
          right: 0px;
          z-index: 9999;
        }
        .settings-container h1 {
          color: ${theme.colors.darkOrange};
          line-height: 17px;
          font-size: ${theme.fontSize.base};
          font-weight: 500;
          font-weight: 500;
          margin-top: 0;
        }
      `}</style>
    </div>
  );
}
