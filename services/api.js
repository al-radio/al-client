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

export const fetchSongHistory = async () => {
  const response = await fetch(`${API_URL}/song/history`);
  return response.json();
};

export const submitSongRequest = async (query) => {
  const response = await fetch(`${API_URL}/song/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
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
  // jwt stored in localStorage
  const jwt = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/accounts`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.json();
};

export const updateProfile = async (id, profile) => {
  const response = await fetch(`${API_URL}/accounts/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });
  return response.json();
};

// Friends Routes
export const fetchFriends = async () => {
  const response = await fetch(`${API_URL}/accounts/friends`);
  return response.json();
};

export const addFriend = async (id) => {
  const response = await fetch(`${API_URL}/accounts/friends/add/${id}`, {
    method: "POST",
  });
  return response.json();
};
