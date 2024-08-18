let CURRENT_SONG_METADATA = {};
let SONG_HISTORY = [];
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const songAlbum = document.getElementById('song-album');
const albumArt = document.getElementById('album-art');
const historyList = document.getElementById('history-list');
const submitForm = document.getElementById('submit-form');
const songQueryInput = document.getElementById('song-query');
const audioPlayer = document.getElementById('audio-player');

// Use this when resuming playback to ensure the stream is up to date
function handleReplayAudio() {
  if (!audioPlayer) return;
  if (!audioPlayer.paused) {
    audioPlayer.pause();
  }

  // use a unique url param to not use cached data
  const audioSourceUrl = '/stream';
  const uniqueUrl = audioSourceUrl + '?t=' + Date.now();
  audioPlayer.src = uniqueUrl;

  // Load and play the audio
  audioPlayer.load();
  audioPlayer.volume = 1.0; // Set desired volume
  audioPlayer.play();
  audioPlayer.currentTime = 0;
}

async function getSongHistory() {
  try {
    const response = await fetch('/history');
    if (!response.ok) throw new Error('Failed to fetch song history');

    const historyData = await response.json();
    if (JSON.stringify(historyData) === JSON.stringify(SONG_HISTORY)) {
      return;
    }

    historyList.innerHTML = '';
    SONG_HISTORY = historyData;
    SONG_HISTORY.forEach(updateSongHistory);
  } catch (error) {
    //
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
  historyList.appendChild(listItem);
}

async function getCurrentSongMetadata() {
  try {
    const response = await fetch('/song');
    if (response.status === 304) {
      // no change in song metadata
      return;
    }
    if (!response.ok) throw new Error('Failed to fetch current song metadata');

    const metadata = await response.json();
    if (metadata.trackId === CURRENT_SONG_METADATA.trackId) {
      return;
    }

    CURRENT_SONG_METADATA = metadata;
    songTitle.innerText = metadata.title;
    songArtist.innerText = metadata.artist;
    songAlbum.innerText = metadata.album;
    albumArt.src = metadata.artUrl;
    albumArt.alt = metadata.title;
    getSongHistory();
  } catch (error) {
    console.error('Error fetching current song metadata:', error);
  }
}

async function confirmSong(trackId) {
  try {
    console.log('Confirming song:', trackId);
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: trackId })
    });
    if (!response.ok) throw new Error(response.statusText);
  } catch (error) {
    console.error('Error confirming song:', error);
  }
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
    const { trackId, title, artist, album } = await response.json();

    // if the result has metadata, we need to ask the user to confirm the song
    if (!trackId) {
      alert(`No song found for query: ${query}`);
      return;
    }
    const isConfirmed = confirm(
      `Do you want to add this song to the queue?\n${title} by ${artist} from the album ${album}`
    );
    if (isConfirmed) {
      confirmSong(trackId);
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

// add a listener for the album art. if it is clicked, toggle the play/pauase state
albumArt.addEventListener('click', () => {
  if (audioPlayer.paused) {
    console.log('playing audio');
    handleReplayAudio();
  } else {
    console.log('pausing audio');
    audioPlayer.pause();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  getCurrentSongMetadata();
  setInterval(getCurrentSongMetadata, 10000);
});
