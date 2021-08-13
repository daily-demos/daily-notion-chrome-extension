import React from 'react';
import theme from '../theme';

export default function BlueButton({ onClick, children }) {
  return (
    <div className="blue-btn-container">
      <button onClick={onClick}>{children}</button>
      <style jsx>{`
        .blue-btn-container button {
          background-color: ${theme.colors.blue};
          border-radius: 3px;
          box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.04),
            0px 0px 4px rgba(0, 0, 0, 0.04);
          display: flex;
          color: ${theme.colors.white};
          font-size: ${theme.fontSize.base};
          padding: 8px 12px 6px;
          width: 268px;
          opacity: 1;
          border: 1px solid ${theme.colors.blue};
          text-align: center;
          display: inline-block;
          font-weight: 500;
        }
        .blue-btn-container button:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
