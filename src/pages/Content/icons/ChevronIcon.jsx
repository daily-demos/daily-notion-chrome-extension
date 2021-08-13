import React from 'react';
import theme from '../theme';

export default function ChevronIcon({ color = theme.colors.darkOrange }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 7L8 10L5 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <style jsx>{`
        svg {
          display: block;
        }
      `}</style>
    </svg>
  );
}
