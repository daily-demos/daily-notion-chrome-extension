import React from 'react';
import theme from '../theme';
import Authorization from './Authorization';
import { Loading } from './Loading';

export default function ValidatingWorkspace({ workspaceValid }) {
  return workspaceValid === null ? (
    <span className="validating-loader">
      <Loading size={16} color={theme.colors.darkOrange} />
      <style jsx>{`
        .validating-loader {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          z-index: 999;
          padding: 4px 0;
        }
      `}</style>
    </span>
  ) : (
    <Authorization valid={workspaceValid} />
  );
}
