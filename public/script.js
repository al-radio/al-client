document.addEventListener('DOMContentLoaded', () => {
  let CURRENT_SONG_METADATA = {};
  const songTitle = document.getElementById('song-title');
  const songArtist = document.getElementById('song-artist');
  const songAlbum = document.getElementById('song-album');
  const albumArt = document.getElementById('album-art');
  const historyList = document.getElementById('history-list');
  const submitForm = document.getElementById('submit-form');
  const songQueryInput = document.getElementById('song-query');

  const currentSongDataEventSource = new EventSource('/song');
  currentSongDataEventSource.onmessage = event => {
    const songData = JSON.parse(event.data);
    updateSongHistory(songData);
    CURRENT_SONG_METADATA = songData;
    songTitle.textContent = CURRENT_SONG_METADATA.title || 'Loading...';
    songArtist.textContent = CURRENT_SONG_METADATA.artist || 'Loading...';
    songAlbum.textContent = CURRENT_SONG_METADATA.album || 'Loading...';
    albumArt.src = CURRENT_SONG_METADATA.artUrl;
  };

  currentSongDataEventSource.onerror = error => {
    console.error('EventSource failed:', error);
    currentSongDataEventSource.close();
  };

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

  function updateSongHistory(songData) {
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
    event.preventDefault();
    const query = songQueryInput.value.trim();
    if (query) {
      submitSong(query);
      songQueryInput.value = '';
    }
  });

  getSongHistory();
});
