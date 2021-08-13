import React from 'react';
import { useCallState } from '../contexts/CallProvider';
import theme from '../theme';

export default function HideCallMsg() {
  const { callUrl } = useCallState();
  return (
    <div className="hide-call-msg">
      {callUrl && <a href={callUrl}>Return to call</a>}
      <p>Call in progress...</p>
      <style jsx>{`
        .hide-call-msg a {
          font-size: ${theme.fontSize.base};
          color: ${theme.colors.darkOrange};
          line-height: 17px;
          margin-bottom: 8px;
          text-decoration: none;
          background-color: ${theme.colors.lightBlue};
          border: 1px solid ${theme.colors.blue};
          border-radius: 3px;
          padding: 8px 12px;
          display: block;
        }
        .hide-call-msg a:hover {
          opacity: 0.8;
        }
        .hide-call-msg p {
          text-align: right;
          font-size: ${theme.fontSize.small};
          color: ${theme.colors.blue};
          line-height: 14px;
        }
      `}</style>
    </div>
  );
}
