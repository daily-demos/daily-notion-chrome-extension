import React from 'react';
import theme from '../theme';

export default function LightButton({
  onClick,
  children,
  colorTheme = 'white',
  textColor = theme.colors.darkOrange,
  disabled = false,
}) {
  return (
    <div className="light-btn-container">
      <button className={colorTheme} onClick={onClick} disabled={disabled}>
        {children}
      </button>
      <style jsx>{`
        .light-btn-container button {
          border-radius: 3px;
          box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.04),
            0px 0px 4px rgba(0, 0, 0, 0.04);
          display: flex;
          color: ${textColor};
          font-size: ${theme.fontSize.base};
          padding: 6px 12px;
          white-space: nowrap;
          text-align: center;
          cursor: pointer;
        }
        .light-btn-container button.white:disabled,
        .light-btn-container button.blue:disabled {
          background-color: ${theme.colors.lightGrey};
          border: 1px solid ${theme.colors.medGrey};
          cursor: not-allowed;
        }
        .light-btn-container button:hover:disabled {
          background-color: ${theme.colors.lightGrey};
        }
        .light-btn-container button.white {
          background-color: ${theme.colors.white};
          border: 1px solid ${theme.colors.lightGrey};
        }
        .light-btn-container button.blue {
          background-color: ${theme.colors.lightBlue};
          border: 1px solid ${theme.colors.blue};
        }
        .light-btn-container button:hover {
          background-color: ${theme.colors.lightestGrey};
        }
        .light-btn-container button :global(svg) {
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}
