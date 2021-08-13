import React from 'react';
import theme from '../theme';
import Card from './Card';
import BlockedIcon from '../icons/BlockedIcon';

export default function PermissionsError() {
  return (
    <div className="blocked-permissions-container">
      <Card>
        <h1 className="header">Permissons blocked</h1>
        <h2 className="subheader">
          Your browser needs camera and microphone access
        </h2>
        <ol className="instructions">
          <li>
            1. Click the camera icon{' '}
            <span>
              <BlockedIcon />
            </span>{' '}
            in your browser&apos;s address bar
          </li>
          <li>2. Select &quot;Always allow&quot;, then click Done</li>
          <li>3. Refresh the page</li>
        </ol>
      </Card>
      <style jsx>{`
        .blocked-permissions-container {
          margin-top: 12px;
        }
        .blocked-permissions-container .header {
          color: ${theme.colors.darkRed};
          font-weight: 400;
          font-size: ${theme.fontSize.small};
          line-height: 14px;
          margin-top: 0;
        }
        .blocked-permissions-container .subheader {
          color: ${theme.colors.darkOrange};
          font-weight: 500;
          font-size: ${theme.fontSize.base};
          line-height: 17px;
          margin: 8px 0;
        }
        .blocked-permissions-container .instructions {
          color: ${theme.colors.darkOrange};
          font-weight: 400;
          font-size: ${theme.fontSize.small};
          padding-left: 0;
          margin-bottom: 0;
        }
        .blocked-permissions-container .instructions li {
          display: flex;
          line-height: 17px;
        }
        .blocked-permissions-container .instructions li:nth-child(2) {
          margin-bottom: 12px;
        }
        .blocked-permissions-container .instructions span {
          margin-left: 4px;
          margin-right: 4px;
        }
      `}</style>
    </div>
  );
}
