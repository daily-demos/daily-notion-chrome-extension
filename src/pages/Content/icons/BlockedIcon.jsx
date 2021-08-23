import React from 'react';

export default function BlockedIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="24" height="24" rx="4" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0"
            transform="translate(-0.333333 -0.291667) scale(0.0208333)"
          />
        </pattern>
        <image
          id="image0"
          width="86"
          height="74"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
}