import React from 'react';
import theme from '../theme';

export default function CamIcon({ color = theme.colors.darkOrange }) {
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
        d="M3.33333 5C2.59695 5 2 5.59695 2 6.33333V9.66667C2 10.403 2.59695 11 3.33333 11H8.66667C9.40305 11 10 10.403 10 9.66667V6.33333C10 5.59695 9.40305 5 8.66667 5H3.33333ZM11 7.29937C11 7.10895 11.0814 6.92761 11.2238 6.8011L12.8904 5.31962C13.3204 4.93746 14 5.24266 14 5.81789V10.1821C14 10.7573 13.3204 11.0625 12.8904 10.6804L11.2238 9.19889C11.0814 9.07238 11 8.89105 11 8.70062V7.29937Z"
        fill={color}
      />
    </svg>
  );
}
