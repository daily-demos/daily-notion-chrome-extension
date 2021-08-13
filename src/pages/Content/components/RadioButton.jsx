import React, { useState } from 'react';
import CheckIcon from '../icons/CheckIcon';
import theme from '../theme';

export default function RadioButton({
  onChange,
  option1Text,
  option2Text,
  defaultChecked,
}) {
  const [selection, setSelection] = useState(`radio-button-${defaultChecked}`);

  const handleChange = (e) => {
    setSelection(e.target.value);
    onChange(e);
  };

  return (
    <div className="radio-button-container" onChange={handleChange}>
      <input
        type="radio"
        id="radio-button-1"
        name="options"
        value="radio-button-1"
        defaultChecked={defaultChecked === 1}
      />
      <label htmlFor="radio-button-1">
        <div
          style={{
            visibility: selection === 'radio-button-1' ? 'visible' : 'hidden',
          }}
        >
          <CheckIcon />
        </div>{' '}
        {option1Text}
      </label>
      <input
        type="radio"
        id="radio-button-2"
        name="options"
        value="radio-button-2"
        defaultChecked={defaultChecked === 2}
      />
      <label htmlFor="radio-button-2">
        <div
          style={{
            visibility: selection === 'radio-button-2' ? 'visible' : 'hidden',
          }}
        >
          <CheckIcon />
        </div>{' '}
        {option2Text}
      </label>
      <style jsx>{`
        .radio-button-container {
          display: flex;
          border: 1px solid ${theme.colors.lightGrey};
          border-radius: 3px;
        }
        .radio-button-container input {
          height: 0;
          width: 0;
        }
        .radio-button-container input + label {
          flex: 1;
          padding: 8px 16px 6px 0;
          display: flex;
          justify-content: center;
          cursor: pointer;
          font-size: ${theme.fontSize.base};
          color: ${theme.colors.darkGrey};
        }
        .radio-button-container input:checked + label {
          background-color: ${theme.colors.lightGrey};
          color: ${theme.colors.darkOrange};
        }
        .radio-button-container .icon {
          margin-right: 4px;
        }
      `}</style>
    </div>
  );
}
