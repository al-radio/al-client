export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Stream Routes
export const fetchListenerCount = () => {
  return new EventSource(`${API_URL}/listeners`);
};

// Song Routes
export const fetchCurrentSong = () => {
  return new EventSource(`${API_URL}/song/current`);
};

export const fetchNextSong = () => {
  return new EventSource(`${API_URL}/song/next`);
};

export const fetchUserSongHistory = async (handle) => {
  const response = await fetch(`${API_URL}/accounts/${handle}/history`);
  return response.json();
};

export const fetchGlobalSongHistory = () => {
  return new EventSource(`${API_URL}/song/history`);
};

export const submitSongRequest = async (query) => {
  const response = await fetch(`${API_URL}/song/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    credentials: "include",
  });
  return response.json();
};

// Account Routes
export const login = async (handle, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ handle, password }),
    credentials: "include",
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

export const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return response.json();
};

export const fetchProfile = async () => {
  const response = await fetch(`${API_URL}/accounts`, {
    credentials: "include",
  });
  return response.json();
};

export const fetchPublicProfile = async (handle) => {
  const response = await fetch(`${API_URL}/accounts/${handle}`);
  return response.json();
};

export const updateProfile = async (handle, profile) => {
  const response = await fetch(`${API_URL}/accounts/${handle}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
    credentials: "include",
  });
  return response.json();
};

// Authorized Services Routes
export const authorizeSpotify = () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = `${API_URL}/auth/spotify/callback`;
  const scopes = "playlist-modify-public playlist-modify-private";

  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
    scopes,
  )}`;
};

export const addSongToSpotifyPlaylist = async (trackId) => {
  const response = await fetch(`${API_URL}/auth/spotify/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trackId }),
    credentials: "include",
  });
  return response.json();
};

export const authorizeLastFM = () => {
  const apiKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
  const redirectUri = `${API_URL}/auth/lastfm/callback`;

  window.location.href = `https://www.last.fm/api/auth/?api_key=${apiKey}&cb=${encodeURIComponent(
    redirectUri,
  )}`;
};

// Admin Queue Routes
export const fetchQueue = async (type) => {
  const urlMap = {
    user: `${API_URL}/admin/queue/user`,
    suggestion: `${API_URL}/admin/queue/suggestion`,
    audio: `${API_URL}/admin/queue/audio`,
  };

  const response = await fetch(urlMap[type], {
    credentials: "include",
  });
  return response.json();
};

export const submitQueueChanges = async (queueType, queueData) => {
  const urlMap = {
    user: `${API_URL}/admin/queue/user`,
    suggestion: `${API_URL}/admin/queue/suggestion`,
    audio: `${API_URL}/admin/queue/audio`,
  };

  const response = await fetch(urlMap[queueType], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: queueData,
    credentials: "include",
  });
  return response.json();
};

export const skipCurrentSong = async () => {
  const response = await fetch(`${API_URL}/admin/skip`, {
    method: "POST",
    credentials: "include",
  });
  return response.json();
};
