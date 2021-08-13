import React, { useCallback, useEffect, useRef, useState } from 'react';
import CloseIcon from '../icons/CloseIcon';
import ChevronIcon from '../icons/ChevronIcon';
import theme from '../theme';
import Card from './Card';
import { useCallState } from '../contexts/CallProvider';
import RadioButton from './RadioButton';
import { REDIRECT_URL } from '../../constants';

export default function Authorization() {
  const codeRef = useRef();
  const { workspaceValid } = useCallState();
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState('');
  const [view, setView] = useState('member');
  const [showAuthorization, setShowAuthorization] = useState(false);

  useEffect(() => {
    if (workspaceValid && submitted) {
      hide();
    }
  }, [workspaceValid, submitted]);

  const validateCode = (e) => {
    e.preventDefault();
    setSubmitted(true);
    chrome.runtime.sendMessage({ validateCode: code }, (res) =>
      console.log(res)
    );
  };

  const show = () => {
    setShowAuthorization(true);
  };
  const hide = () => {
    setShowAuthorization(false);
    setSubmitted(false);
    setCode('');
    setView('member');
  };

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Backspace') {
        setCode(e.target.value.slice(0, -1));
        setTimeout(() => {
          if (!codeRef?.current) return;
          codeRef.current.focus();
        }, 10);
      }
    },
    [codeRef]
  );
  const onChange = (e) => {
    setCode(e.target.value);
  };
  const onPaste = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCode(e.clipboardData.getData('Text'));
  };

  const onChangeView = (e) => {
    const type = e.target.value === 'radio-button-1' ? 'admin' : 'member';
    setView(type);
  };

  return (
    <div className="authorization-container">
      <Card padding={showAuthorization ? 16 : 6}>
        {!showAuthorization ? (
          <button className="disable-button" onClick={show}>
            <ChevronIcon />
          </button>
        ) : (
          <>
            <div className="authorization-message">
              <button onClick={hide}>
                <CloseIcon />
              </button>
              <h2>Authorize Daily Collab</h2>
              <h3>
                A Notion admin must authorize this app. Users enter access code
                provided by admin.
              </h3>
              <RadioButton
                onChange={onChangeView}
                option1Text="Admin"
                option2Text="Members"
                defaultChecked={view === 'admin' ? 1 : 2}
              />

              {view === 'admin' ? (
                <>
                  <p>
                    Notion workspace admin must authorize Daily Collab. Clicking
                    "Authorize" opens a new tab. Select the Notion docs you'd
                    like to authorize.
                  </p>
                  <p>Transcription will not work for unauthorized documents.</p>
                  <a href={REDIRECT_URL} target="_blank" rel="noreferrer">
                    Authorize
                  </a>
                </>
              ) : (
                <form onSubmit={validateCode}>
                  <label htmlFor="password">
                    To use Daily Collab, enter the access code provided by a
                    Notion admin.
                  </label>
                  <input
                    ref={codeRef}
                    type="text"
                    name="password"
                    id="password"
                    value={code}
                    onKeyDown={onKeyDown}
                    onChange={onChange}
                    onPaste={onPaste}
                    placeholder="Enter access code"
                  />
                  <input type="submit" value="Authorize" />
                  <p className="error-msg">
                    {workspaceValid === false
                      ? 'Invalid access code'
                      : workspaceValid === null
                      ? 'Requires authorization'
                      : 'Authorization successful'}
                  </p>
                </form>
              )}
            </div>
          </>
        )}
      </Card>
      <style jsx>{`
        .authorization-container {
          max-width: 300px;
          z-index: 10;
        }
        .authorization-message {
          position: relative;
        }
        .authorization-message button {
          background: transparent;
          border: none;
          position: absolute;
          right: -12px;
          top: -8px;
        }
        .authorization-container .disable-button {
          background: transparent;
          border: none;
          padding: 0;
          display: block;
        }
        .authorization-message h2 {
          margin-top: 0;
          font-weight: 600;
          font-size: ${theme.fontSize.base};
        }
        .authorization-message h3 {
          margin: 0;
          display: block;
          color: ${theme.colors.darkGrey};
          font-size: ${theme.fontSize.small};
          line-height: 14px;
          font-weight: 400;
          margin-bottom: 12px;
        }
        .authorization-message {
          background-color: ${theme.colors.white};
          color: ${theme.colors.darkOrange};
          margin-top: 0;
          font-weight: 400;
          font-size: ${theme.fontSize.small};
        }
        .authorization-message form {
          display: flex;
          flex-direction: column;
        }
        .authorization-message label {
          display: block;
          color: ${theme.colors.darkOrange};
          font-size: ${theme.fontSize.small};
          margin: 12px 0 9px;
          line-height: 14px;
        }
        .authorization-message input {
          border: 1px solid ${theme.colors.medGrey};
          font-size: ${theme.fontSize.small};
          padding: 8px 8px 7px 4px;
          color: ${theme.colors.darkOrange};
          width: 266px;
          margin-bottom: 8px;
        }
        .authorization-message input::placeholder {
          font-size: ${theme.fontSize.small};
        }
        .authorization-message input[type='submit'],
        .authorization-message a {
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
          text-decoration: none;
        }
        .authorization-message input[type='submit']:hover,
        .authorization-message a:hover,
        .authorization-message a:active {
          opacity: 0.8;
        }
        .authorization-container {
          max-width: 300px;
        }
        .error-msg {
          color: ${theme.colors.orange};
          margin: 0;
        }
      `}</style>
    </div>
  );
}
