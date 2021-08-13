import React from 'react';
import theme from '../theme';

export default function PeopleIcon({ color = theme.colors.darkOrange }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.33333 4.66667C5.33333 3.33333 6 2 8 2C10 2 10.6667 3.33333 10.6667 4.66667C10.6667 6.66667 9.47276 8 8 8C6.52724 8 5.33333 6.66667 5.33333 4.66667ZM3 13.3333C3 10.9181 3.82034 9.59657 5.95637 8.3782C6.57134 8.77692 7.27909 9 8 9C8.72121 9 9.42924 8.77674 10.0444 8.37772C12.1797 9.59022 12.9989 10.8812 12.9989 13.2962C12.9996 13.3086 13 13.3209 13 13.3333C13 13.681 12.7182 13.9628 12.3705 13.9628L12.3322 13.9629L3.66667 14C3.29848 14 3 13.7015 3 13.3333Z"
        fill={color}
      />
    </svg>
  );
}
