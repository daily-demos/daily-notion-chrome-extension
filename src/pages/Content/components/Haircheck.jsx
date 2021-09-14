import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCallState } from '../contexts/CallProvider';
import Card from './Card';
import theme from '../theme';
import BlueButton from './BlueButton';
import SettingsOptions from './SettingsOptions';
import Tile from './Tile';
import PermissionsError from './PermissionsError';

export default function Haircheck() {
  const {
    setCallState,
    daily,
    dailyUrl,
    participants,
    deviceError,
    callType,
    setButtonLoading,
  } = useCallState();
  const inputRef = useRef(null);
  const [username, setUsername] = useState('');

  /**
   * If the local user already has a name stored in local store, add
   * it to the input as the default value
   */
  useEffect(() => {
    if (!inputRef?.current) return;
    const storedName = localStorage.getItem('daily-notion-username');
    if (storedName && !inputRef.current.value) {
      setUsername(storedName);
    }
  }, [inputRef]);

  /**
   * Join Daily call
   */
  const joinCall = useCallback(() => {
    setButtonLoading(true);
    if (!daily) return;
    const userName = inputRef?.current?.value?.trim();

    if (userName) {
      localStorage.setItem('daily-notion-username', userName);
    }

    daily
      .join({
        userName,
        // Use lowest simulcast layer since the videos have small display anyway
        receiveSettings: {
          base: { video: { layer: 0 } }, // default: { layer: 2 }
        },
      })
      .then(() => {
        setCallState('joined');
        setButtonLoading(false);
      })
      .catch((e) => {
        console.warn(e);
        setCallState('error');
        setButtonLoading(false);
      });
  }, [daily, dailyUrl]);

  const localParticipant = useMemo(
    () => participants?.filter((p) => p?.local)[0],
    [participants]
  );

  /**
   * Hack alert: Notion is hijacking the backspace key so
   * we have to force focus back on the username input to
   * be able to edit the input value.
   */
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Backspace') {
        setUsername(e.target.value.slice(0, -1));
        setTimeout(() => {
          inputRef.current.focus();
        }, 10);
      }
    },
    [inputRef]
  );

  /**
   * Update username in store whenever the input value changes
   */
  const onChange = (e) => {
    setUsername(e.target.value);
  };

  /**
   * Show the permissions error is access to devices are not permitted.
   * Cam and mic access are required but don't need to be turned on in
   * the call.
   */
  if (deviceError) {
    return <PermissionsError />;
  }

  return (
    <div className="hair-check-container">
      <Card>
        <h1>Setup your hardware</h1>
        {localParticipant && callType === 'video' && (
          <div className="tile-container">
            <Tile
              tileHeight={194}
              tileWidth={265}
              participant={localParticipant}
            />
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          onKeyDown={onKeyDown}
          onChange={onChange}
          placeholder="Enter username"
          value={username}
        />
        <SettingsOptions />
        <div className="join-btn">
          <BlueButton onClick={joinCall}>Join call</BlueButton>
        </div>
      </Card>
      <style jsx>{`
        .hair-check-container {
          position: absolute;
          top: 44px;
          right: 0;
          z-index: 9999;
        }
        .hair-check-container h1 {
          color: ${theme.colors.darkOrange};
          line-height: 17px;
          font-size: ${theme.fontSize.base};
          font-weight: 500;
          font-weight: 500;
          margin-top: 0;
        }
        .join-btn {
          margin-top: 12px;
        }
        .tile-container {
          margin-bottom: 8px;
        }
        input {
          border: 1px solid ${theme.colors.medGrey};
          font-size: ${theme.fontSize.base};
          padding: 8px 8px 7px 4px;
          color: ${theme.colors.darkOrange};
          width: 266px;
        }
      `}</style>
    </div>
  );
}
