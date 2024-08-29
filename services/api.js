export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Stream Routes
export const fetchListenerCount = async () => {
  const response = await fetch(`${API_URL}/listeners`);
  return response.json();
};

// Song Routes
export const fetchCurrentSong = async () => {
  const response = await fetch(`${API_URL}/song/current`);
  return response.json();
};

export const fetchNextSong = async () => {
  const response = await fetch(`${API_URL}/song/next`);
  return response.json();
};

export const fetchSongHistory = async (handle = null) => {
  if (handle) {
    // temp until server deploys force lowercase
    handle = handle.trim().toLowerCase();
    const response = await fetch(`${API_URL}/accounts/${handle}/history`);
    return response.json();
  }
  const response = await fetch(`${API_URL}/song/history`);
  return response.json();
};

export const submitSongRequest = async (query) => {
  const jwt = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/song/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ query }),
  });
  return response.json();
};

// Account Routes
export const login = async (handle, password) => {
  // temp until server deploys force lowercase
  handle = handle.trim().toLowerCase();
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ handle, password }),
  });
  return response.json();
};

export const register = async (email, handle, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, handle, password }),
  });
  return response.json();
};

export const fetchProfile = async (handle) => {
  // temp until server deploys force lowercase
  handle = handle.trim().toLowerCase();
  // jwt stored in localStorage
  const jwt = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/accounts`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.json();
};

export const updateProfile = async (handle, profile) => {
  const response = await fetch(`${API_URL}/accounts/${handle}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });
  return response.json();
};

// Admin Queue Routes
export const fetchQueue = async (type) => {
  const jwt = localStorage.getItem("token");
  const urlMap = {
    user: `${API_URL}/admin/queue/user`,
    suggestion: `${API_URL}/admin/queue/suggestion`,
    audio: `${API_URL}/admin/queue/audio`,
  };

  const response = await fetch(urlMap[type], {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.json();
};

export const submitQueueChanges = async (queueType, queueData) => {
  const jwt = localStorage.getItem("token");
  const urlMap = {
    user: `${API_URL}/admin/queue/user`,
    suggestion: `${API_URL}/admin/queue/suggestion`,
    audio: `${API_URL}/admin/queue/audio`,
  };

  const response = await fetch(urlMap[queueType], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: queueData,
  });
  return response.json();
};

export const skipCurrentSong = async () => {
  const jwt = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/skip`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.json();
};
