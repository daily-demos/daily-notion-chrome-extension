import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import DailyIframe from '@daily-co/daily-js';

const UNAUTHORIZED_ERROR =
  'Access code does not match page ID. End call and reauthorize.';
const ROOM_ERROR = 'Room could not be created';

const addTextToNotionFromBackground = (newText, workspaceId, username) => {
  chrome.runtime.sendMessage({ newText, workspaceId, username }, (res) =>
    console.log(res)
  );
};

const deleteCallFromBackground = (workspaceId) => {
  chrome.runtime.sendMessage({ endCall: true, workspaceId }, (res) =>
    console.log(res)
  );
};

const getDailyRoom = (workspaceId) => {
  chrome.runtime.sendMessage({ getDailyRoom: true, workspaceId }, (res) =>
    console.log(res)
  );
};

export const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  const [callState, setCallState] = useState('idle');
  const [messageReceived, setMessageReceived] = useState(false);
  const [daily, setDaily] = useState(null);
  const [useTranscription, setUseTranscription] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [participants, setParticipants] = useState(null);
  const [audioInput, setAudioInput] = useState([]);
  const [audioOutput, setAudioOutput] = useState([]);
  const [videoInput, setVideoInput] = useState([]);
  const [callType, setCallType] = useState('video');
  const [dailyUrl, setDailyUrl] = useState(null);
  const [backgroundListenerAdded, setBackgroundListenerAdded] = useState(false);
  const [deviceError, setDeviceError] = useState(null);
  const [backgroundError, setBackgroundError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [activeSpeakerPeerId, setActiveSpeakerPeerId] = useState(null);
  const [name, setName] = useState('');
  const [workspaceId, setWorkspaceId] = useState(null);
  const [workspaceValid, setWorkspaceValid] = useState(null);
  const [speakerId, setSpeakerId] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [callUrl, setCallUrl] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  /**
   * Poll for room details every second to ensure the local
   * user is always getting current info on whether the active Notion doc
   * has a live room or not.
   */
  let interval;
  useEffect(() => {
    interval = setInterval(() => getDailyRoom(workspaceId), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  /**
   * Get the Notion workspace ID from local storage. It it added to local
   * storage when Notion is authenticated with the auth code. If it's not
   * in local, assume the Notion features (transcription) have not been
   * authenticated.
   */
  useEffect(() => {
    if (!workspaceId) {
      const code = localStorage.getItem('daily-notion-code');
      if (code) {
        console.log('[VALIDATING CODE]');
        chrome.runtime.sendMessage({ validateCode: code }, (res) =>
          console.log(res)
        );
      }
    }
  }, [workspaceId]);

  const resetCallState = useCallback(() => {
    setDailyUrl(null);
    setCallType('video');
    setIsTranscribing(false);
    setUseTranscription(false);
    setCallUrl(null);
    setAuthError(null);
    setBackgroundError(null);
    leaveCall();
  }, [leaveCall]);

  /**
   * Add a listener for any messages coming from the background script.
   * This is the main point of contact for the background script
   * communicating with the content script.
   */
  useEffect(() => {
    if (backgroundListenerAdded) return;
    function receiveDailyUrlInfo(request) {
      if (!messageReceived) {
        setMessageReceived(true);
      }
      const keys = Object.keys(request);

      if (keys.includes('notFound')) {
        // Assume workspace or page has changed and reset call state
        resetCallState();
      }
      // clear auth error if the tab changes
      if (keys.includes('clearAuthError')) {
        setAuthError(null);
      }
      // Set Daily room info provided by Daily Collab API in background script.
      // If there's no Daily room info, assume a call is not live and reset state to defaults.
      if (keys.includes('dailyUrl') && request?.dailyUrl) {
        setDailyUrl(request.dailyUrl);
        setCallType(request.audioOnly ? 'audio' : 'video');
        setIsTranscribing(request.isTranscribing);
        setUseTranscription(request.useTranscription);
        setCallUrl(request.docUrl);
      } else if (keys.includes('dailyUrl') && !request?.dailyUrl) {
        resetCallState();
      }
      if (keys.includes('workspaceValid')) {
        setAuthError(null);
        setWorkspaceValid(request.workspaceValid);
        if (request.code) {
          localStorage.setItem('daily-notion-code', request.code);
          setWorkspaceId(request.code);
        }
      }
      if ([UNAUTHORIZED_ERROR, ROOM_ERROR].includes(request?.error)) {
        setAuthError(request.error);
      } else {
        setBackgroundError(request.error || null);
      }
      setBackgroundListenerAdded(true);
    }

    chrome.runtime.onMessage.addListener(receiveDailyUrlInfo);
  }, [backgroundListenerAdded, messageReceived, callUrl]);

  /**
   * DAILY EVENT CALLBACKS
   */

  const handleCameraStarted = useCallback(
    (e) => {
      console.log('[CAMERA STARTED]', e);
      setCameraStarted(true);
      const p = daily?.participants();
      if (p) {
        setParticipants(Object.values(p));
      }
    },
    [daily]
  );
  const updateParticipants = useCallback(
    (e) => {
      console.log('[PARTICIPANT UPDATED]', e);
      const p = daily?.participants();
      if (p) {
        setParticipants(Object.values(p));
      }
    },
    [daily]
  );
  const joined = (e) => {
    console.log('JOINED');
    console.log(e);
  };
  const updateActiveSpeaker = (e) => {
    console.log('[ACTIVE SPEAKER CHANGE]');
    if (e?.activeSpeaker?.peerId) {
      setActiveSpeakerPeerId(e?.activeSpeaker?.peerId);
    }
  };
  const handleCameraError = (e) => {
    console.log('[DEVICE ERROR]', e);
    if (e?.errorMsg?.errorMsg) {
      setDeviceError(e?.errorMsg?.errorMsg);
    }
  };

  const leaveCall = useCallback(() => {
    if (!daily) return;
    const endDailyCall = participants?.length === 1;

    daily.leave().then(() => {
      setCallState('idle');
      daily.destroy();
      setButtonLoading(false);
      setDaily(null);
      if (endDailyCall) {
        setDailyUrl(null);
        deleteCallFromBackground(workspaceId);
      }
    });
  }, [daily, participants, workspaceId]);

  /**
   * [END] DAILY EVENT CALLBACKS
   */

  /**
   * Get all available devices for local user
   */
  const devices = useMemo(() => {
    if (!daily) return;
    const devices = daily.enumerateDevices();
    return devices;
  }, [daily, participants, cameraStarted]);

  /**
   * Start new call on Notion doc
   */
  const createCallObject = useCallback(() => {
    const url = dailyUrl;
    const audioOnlyOptions = {
      videoSource: false,
      dailyConfig: {
        experimentalChromeVideoMuteLightOff: true,
      },
      url,
    };
    const videoOptions = {
      url,
    };
    const co = DailyIframe.createCallObject(
      callType === 'audio' ? audioOnlyOptions : videoOptions
    );

    setDaily(co);
  }, [callType, dailyUrl]);

  /**
   * Clean up (destroy) callframe if there isn't a Daily URL set.
   * This is added just in case it's not destroyed in the regular
   * user flow.
   */
  useEffect(() => {
    if (daily && !dailyUrl) {
      /**
       * daily be truthy and the dailyUrl being falsy indicates a tab change.
       * for now, just exit the call.
       */
      leaveCall();
    }
  }, [daily, dailyUrl]);

  /**
   * Get and set devices for settings menu
   */
  useEffect(() => {
    if (!daily) return;
    const getDevices = async () => {
      const audioIn = [];
      const audioOut = [];
      const videoIn = [];
      const devicesArr = await daily.enumerateDevices();
      if (!devicesArr?.devices) return [];
      devicesArr.devices.forEach((d) => {
        if (d?.kind === 'audioinput') {
          audioIn.push(d);
        } else if (d?.kind === 'audiooutput') {
          audioOut.push(d);
        } else if (d?.kind === 'videoinput') {
          videoIn.push(d);
        }
      });
      setAudioInput(audioIn);
      setAudioOutput(audioOut);
      setVideoInput(videoIn);
    };
    getDevices();
  }, [daily, cameraStarted]);

  /**
   * Add Daily event listeners to callframe
   */
  useEffect(() => {
    if (!daily) return;

    const handleAppMessage = (e) => {
      console.log('[APP MESSAGE]');
      console.log(e);
      // Check if the message is transcription text
      if (e?.fromId === 'transcription' && e?.data?.is_final) {
        const p = daily.participants();
        const local = p.local;

        const speakerHasChanged =
          e.data.session_id !== speakerId || speakerId === null;
        const name = speakerHasChanged ? local.user_name || 'Guest' : null;
        // Each participant handles added their own text to avoid duplication
        if (local.session_id === e.data.session_id) {
          /**
           * Send message to background script to add the transcription text to Notion doc
           */
          addTextToNotionFromBackground(e.data.text, workspaceId, name);
        }
        setSpeakerId(e.data.session_id);
      }
    };

    const handleError = (e) => {
      if (e?.errorMsg === "The meeting you're trying to join does not exist.") {
        deleteCallFromBackground(workspaceId);
      }
    };

    daily
      .on('loaded', updateParticipants)
      .on('started-camera', handleCameraStarted)
      .on('camera-error', handleCameraError)
      .on('joined-meeting', joined)
      .on('participant-updated', updateParticipants)
      .on('participant-joined', updateParticipants)
      .on('participant-left', updateParticipants)
      .on('error', handleError)
      .on('left-meeting', updateParticipants)
      .on('track-started', updateParticipants)
      .on('track-stopped', updateParticipants)
      .on('active-speaker-change', updateActiveSpeaker)
      .on('app-message', handleAppMessage);

    return () => {
      daily
        .off('loaded', updateParticipants)
        .off('started-camera', updateParticipants)
        .off('camera-error', updateParticipants)
        .off('joined-meeting', updateParticipants)
        .off('participant-updated', updateParticipants)
        .off('participant-joined', updateParticipants)
        .off('participant-left', updateParticipants)
        .off('error', handleError)
        .off('left-meeting', updateParticipants)
        .off('track-started', updateParticipants)
        .off('track-stopped', updateParticipants)
        .off('active-speaker-change', updateActiveSpeaker)
        .off('app-message', handleAppMessage);
    };
  }, [daily, workspaceId, speakerId]);

  return (
    <CallContext.Provider
      value={{
        callState,
        setCallState,
        daily,
        setDaily,
        participants,
        setParticipants,
        useTranscription,
        setUseTranscription,
        callType,
        setCallType,
        leaveCall,
        devices,
        audioInput,
        setAudioInput,
        audioOutput,
        setAudioOutput,
        videoInput,
        setVideoInput,
        isTranscribing,
        setIsTranscribing,
        dailyUrl,
        messageReceived,
        backgroundError,
        setBackgroundError,
        activeSpeakerPeerId,
        name,
        setName,
        createCallObject,
        deviceError,
        workspaceValid,
        workspaceId,
        authError,
        setAuthError,
        callUrl,
        buttonLoading,
        setButtonLoading,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
export const useCallState = () => useContext(CallContext);
