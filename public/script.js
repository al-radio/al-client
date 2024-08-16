let CURRENT_SONG_METADATA = {};

document.addEventListener('DOMContentLoaded', () => {
  const songTitle = document.getElementById('song-title');
  const songArtist = document.getElementById('song-artist');
  const songAlbum = document.getElementById('song-album');
  const albumArt = document.getElementById('album-art');
  const historyList = document.getElementById('history-list');
  const submitForm = document.getElementById('submit-form');
  const songQueryInput = document.getElementById('song-query');

  async function getSongInfo() {
    try {
      const response = await fetch('/song');
      if (!response.ok) throw new Error('Failed to fetch song metadata');

      const songData = await response.json();
      if (songData.title === CURRENT_SONG_METADATA.title) return;
      songTitle.textContent = songData.title;
      songArtist.textContent = `${songData.artist}`;
      songAlbum.textContent = `${songData.album}`;
      albumArt.src = songData.artUrl || 'default-album-art.png';
      await updateSongHistory(CURRENT_SONG_METADATA);
      CURRENT_SONG_METADATA = songData;
    } catch (error) {
      console.error('Error fetching song info:', error);
    }
  }

  async function getSongHistory() {
    try {
      const response = await fetch('/history');
      if (!response.ok) throw new Error('Failed to fetch song history');

      const historyData = await response.json();
      historyList.innerHTML = ''; // Clear current list

      historyData.forEach(song => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <strong>${song.title}</strong> by ${song.artist} (Album: ${song.album})
          <br><img src="${song.artUrl}" alt="${song.title}" class="history-art">
        `;
        historyList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error fetching song history:', error);
    }
  }

  async function updateSongHistory(songData) {
    if (!songData.title) return;
    // Add the new song to the top of the history list
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>${songData.title}</strong> by ${songData.artist} (Album: ${songData.album})
      <br><img src="${songData.artUrl}" alt="${songData.title}" class="history-art">
    `;
    historyList.prepend(listItem);
  }

  async function submitSong(query) {
    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const result = await response.json();
      if (result.success) {
        console.log('Song submitted successfully');
      } else {
        console.error('Failed to submit song');
      }
    } catch (error) {
      console.error('Error submitting song:', error);
    }
  }

  submitForm.addEventListener('submit', event => {
    event.preventDefault(); // Prevent the form from submitting the default way
    const query = songQueryInput.value.trim();
    if (query) {
      submitSong(query);
      songQueryInput.value = ''; // Clear the input field
    }
  });

  // Initial fetch of song info and history
  getSongInfo();
  getSongHistory();

  // Poll for song info updates every 10 seconds
  setInterval(getSongInfo, 10000);
});
