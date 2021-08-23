import React from 'react';
import Card from './Card';
import theme from '../theme';

export default function ErrorMsg({ authError, backgroundError }) {
  return (
    <div className="error-container">
      <Card
        padding={4}
        borderColor={theme.colors.red}
        background={theme.colors.lightRed}
      >
        <p className="background-error">{authError}</p>
        <p className="background-error">{backgroundError}</p>
      </Card>
      <style jsx>{`
        .error-container {
          position: absolute;
          top: -32px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
