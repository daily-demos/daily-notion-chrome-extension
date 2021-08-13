import { BASE_URL } from '../constants';

const noop = (res) => console.log(res);
const UNAUTHORIZED_ERROR =
  'Access code does not match page ID. End call and reauthorize.';

/**
 * Handle responses from Daily Collab API requests
 */
async function handleGetResponse(response) {
  if (response.status === 500) {
    console.error('server error');
    return { error: 'Server error' };
  }
  if (response.status === 404) {
    return { notFound: true };
  }
  if (response.status !== 200) {
    return { error: 'Error' };
  }
  return response.json();
}

async function handleResponse(response) {
  if (response.status === 500) {
    console.error('server error');
    return { error: 'Server error' };
  }
  if (response.status !== 200) {
    return { error: 'Error' };
  }
  return response.json();
}

async function handleTranscriptionResponse(response) {
  const res = await response.json();
  if (res.status === 500) {
    console.error('server error');
    return { error: 'Server error' };
  }
  if (
    (res.status === 404 && res.code === 'object_not_found') ||
    res.code === 'unauthorized'
  ) {
    return { error: UNAUTHORIZED_ERROR };
  }
  if (res.status !== 200) {
    return { error: 'Error' };
  }
  return res;
}

/**
 * Daily Collab endpoint usage
 * */

/**
 * Workspace endpoint
 */
async function getWorkspace(url = BASE_URL, workspaceId) {
  const workspace = await fetch(`${url}/workspaces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workspaceId,
    }),
  });

  return handleGetResponse(workspace);
}

/**
 * Room endpoints
 */
async function getRoom(url = BASE_URL, id) {
  const room = await fetch(`${url}/calls/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleGetResponse(room);
}
async function createRoom({
  baseUrl = BASE_URL,
  tabId,
  audioOnly = false,
  useTranscription = false,
  workspaceId,
  docUrl,
}) {
  const options = {
    audioOnly,
    useTranscription,
    docUrl,
  };

  if (workspaceId) {
    options.workspaceId = workspaceId;
  }

  const room = await fetch(`${baseUrl}/calls/${tabId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
  return handleResponse(room);
}
async function deleteRoom(url = BASE_URL, id) {
  const room = await fetch(`${url}/calls/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(room);
}
/**
 * Get current Daily room and return to content script. (If null, there is no active Daily call.)
 */
const getDailyRoomForContentScript = async (tab) => {
  const notionId = getNotionId(tab);
  if (!notionId) return;

  const room = await getRoom(BASE_URL, notionId);
  console.log(room);
  const message = room.dailyUrl
    ? {
        dailyUrl: room.dailyUrl,
        audioOnly: room.audioOnly,
        isTranscribing: room.isTranscribing,
        useTranscription: room.useTranscription,
        docUrl: room.docUrl,
      }
    : room;

  chrome.tabs.sendMessage(tab.id, message, noop);
};

/**
 * Transcription endpoints
 * */
async function appendText(id, text, workspaceId, username) {
  if (text === 'I') {
    // this seems to be the text for breathing or background sounds when the person isn't speaking
    console.log(`Cancel appending text: ${text}`);
    return;
  }
  const shortId = id.slice(id.length - 32);
  const block = await fetch(`${BASE_URL}/calls/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      isTranscribing: true,
      shortId,
      workspaceId,
      username,
    }),
  });
  const response = await handleTranscriptionResponse(block);
  return response;
}
async function endTranscribing(id, workspaceId) {
  const block = await fetch(`${BASE_URL}/calls/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: null, isTranscribing: false, workspaceId }),
  });
  return handleResponse(block);
}

/**
 * Check if the current tab is Notion. If it is, send message to content script. Otherwise, do nothing.
 */
const getNotionId = (tab) => {
  const split = tab.url.split('/');
  return split.pop(); // last value is the id
};

//** MESSAGE HANDLERS FOR CONTENT SCRIPT MESSAGES */

/**
 * Handle START message received from content script: start call - POST Notion ID and send back Daily URL or error message
 */

async function createDailyCall(request, tab) {
  const notionId = getNotionId(tab);
  if (!notionId) return;
  const room = await createRoom({
    baseUrl: BASE_URL,
    tabId: notionId,
    audioOnly: request.audioOnly,
    useTranscription: request.useTranscription,
    workspaceId: request?.workspaceId,
    docUrl: tab?.url,
  });
  console.log(room);

  const message = room.dailyUrl
    ? {
        dailyUrl: room.dailyUrl,
        audioOnly: room.audioOnly,
        isTranscribing: room.isTranscribing,
        useTranscription: room.useTranscription,
      }
    : { error: 'Room could not be created' };
  chrome.tabs.sendMessage(tab.id, message, noop);
}

/**
 * Handle LEAVE message received from content script: the last call attendee will end a call, so the Daily URL cam be be disassociated from the Notion ID
 */

async function endDailyCall(request, tab) {
  const notionId = getNotionId(tab);
  if (!notionId) return;
  const res = await deleteRoom(BASE_URL, notionId);

  let message = { error: '' };
  // set success msg and clear in-call state if the call was ended successfully
  if (res.success) {
    message = {
      dailyUrl: null,
    };
  }
  chrome.tabs.sendMessage(tab?.id, message, noop);
}

/**
 * Update call item and send PATCH request to Notion API from endpoint to append transcription text to current doc associated with call
 */

async function addTranscriptionTextToNotionDoc(request, tab) {
  const notionId = getNotionId(tab);
  if (!notionId) return;

  const block = await appendText(
    notionId,
    request?.newText,
    request?.workspaceId,
    request?.username
  );

  // send error if there was an error and text to append
  if (block?.error) {
    const error = block.error === UNAUTHORIZED_ERROR ? block.error : '';
    const message = {
      error,
    };
    chrome.tabs.sendMessage(tab?.id, message, noop);
  }
}
/**
 * Ends transcription status in call item
 */

async function endCurrentTranscription(request, tab) {
  const notionId = getNotionId(tab);
  if (!notionId) return;

  const ending = await endTranscribing(notionId, request.workspaceId);
  if (ending.error) {
    const message = {
      error: 'Error ending transcription.',
    };
    chrome.tabs.sendMessage(tab?.id, message, noop);
  }
}
/**
 * Validate workspace code supplied by Notion user to authenticate them
 */

async function validateWorkspaceCode(code, id) {
  console.log(code);
  if (!id) return;
  const workspace = await getWorkspace(BASE_URL, code);

  let message = { workspaceValid: false };
  if (workspace.workspaceId) {
    message = { workspaceValid: true, code: workspace.workspaceId };
  }
  chrome.tabs.sendMessage(id, message, noop);
}

async function handleMessageReceived(request, sender, sendResponse) {
  const {
    newText,
    endCall,
    createCall,
    endTranscribingStatus,
    startTranscription,
    workspaceId,
    validateCode,
    getDailyRoom,
  } = request;

  if (validateCode) {
    validateWorkspaceCode(validateCode, sender.tab.id);
  } else if (getDailyRoom) {
    getDailyRoomForContentScript(sender.tab);
  } else if (createCall) {
    await createDailyCall(request, sender.tab);
  } else if (endCall) {
    await endDailyCall(request, sender.tab);
  }

  if (!workspaceId) {
    // added for debugging
    console.log('Workspace not set', request);
  }

  /**
   * Messages that require the Notion API to be authenticated.
   * In v1, this is anything related to transcription.
   */
  if (newText) {
    await addTranscriptionTextToNotionDoc(request, sender.tab);
  } else if (startTranscription) {
    await addTranscriptionTextToNotionDoc(request, sender.tab);
  } else if (endTranscribingStatus) {
    endCurrentTranscription(request, sender.tab);
  }
  sendResponse('message received');
}

/**
 * Listen for messages and determine which message is sent in parent handler above
 */
chrome.runtime.onMessage.addListener(handleMessageReceived);

/**
 * Event listeners to let content scripts know about tab activations/updates
 */
chrome.tabs.onActivated.addListener(() => {
  setTimeout(async () => {
    await chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        const tab = tabs[0];
        getDailyRoomForContentScript(tab);
      }
    );
  }, 250);
});
chrome.tabs.onUpdated.addListener(function () {
  setTimeout(async () => {
    await chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        const tab = tabs[0];
        getDailyRoomForContentScript(tab);
      }
    );
  }, 250);
});
