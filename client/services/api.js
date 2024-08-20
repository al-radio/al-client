export const API_URL = "http://localhost:3002";

export const fetchCurrentSong = async () => {
  const response = await fetch(`${API_URL}/song`);
  return response.json();
};

export const fetchNextSong = async () => {
  const response = await fetch(`${API_URL}/next`);
  return response.json();
};

export const fetchSongHistory = async () => {
  const response = await fetch(`${API_URL}/history`);
  return response.json();
};

export const fetchListenerCount = async () => {
  const response = await fetch(`${API_URL}/listeners`);
  return response.json();
};
