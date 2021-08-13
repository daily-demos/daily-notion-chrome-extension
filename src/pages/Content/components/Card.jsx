import React from 'react';
import theme from '../theme';

export default function Card({
  children,
  padding = 16,
  background = theme.colors.white,
  borderColor = theme.colors.lightGrey,
}) {
  return (
    <div className="card-container">
      {children}
      <style jsx>{`
        .card-container {
          background: ${background};
          border: 1px solid ${borderColor};
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.04),
            0px 0px 4px rgba(0, 0, 0, 0.08);
          border-radius: 3px;
          padding: ${padding}px;
        }
      `}</style>
    </div>
  );
}
