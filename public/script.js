let CURRENT_SONG_METADATA = {};
let NEXT_SONG_METADATA = {};
let SONG_HISTORY = [];

// current song
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const songAlbum = document.getElementById('song-album');
const albumArt = document.getElementById('album-art');

// next song
const nextSongTitle = document.getElementById('next-song-title');
const nextSongArtist = document.getElementById('next-song-artist');
const nextSongAlbum = document.getElementById('next-song-album');
const nextAlbumArt = document.getElementById('next-album-art');

// history
const historyList = document.getElementById('history-list');

// song submission
const submitForm = document.getElementById('submit-form');
const songQueryInput = document.getElementById('song-query');

// audio player
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
    <br><img src="${songData.artUrl}" alt="${songData.album}" class="history-art">
  `;
  historyList.appendChild(listItem);
}

function updateMediaSessionMetadata() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: CURRENT_SONG_METADATA.title,
      artist: CURRENT_SONG_METADATA.artist,
      album: CURRENT_SONG_METADATA.album,
      artwork: [{ src: CURRENT_SONG_METADATA.artUrl, sizes: '96x96', type: 'image/png' }]
    });
  }
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
    songTitle.innerText = CURRENT_SONG_METADATA.title;
    songArtist.innerText = CURRENT_SONG_METADATA.artist;
    songAlbum.innerText = CURRENT_SONG_METADATA.album;
    albumArt.src = CURRENT_SONG_METADATA.artUrl;
    albumArt.alt = CURRENT_SONG_METADATA.album;
    getSongHistory();
    updateMediaSessionMetadata();
    getNextSong();
  } catch (error) {
    console.error('Error fetching current song metadata:', error);
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
    const { success, message, metadata } = await response.json();
    if (!success) {
      console.error('Error submitting song:', message);
      return;
    }

    if (!metadata) {
      console.log('Song Submitted');
      return;
    }

    if (metadata.trackId) {
      const { title, artist, album, trackId } = metadata;
      const isConfirmed = confirm(
        `Do you want to add this song to the queue?\n${title} by ${artist} from the album ${album}`
      );
      if (isConfirmed) {
        submitSong(trackId);
      }
    }
  } catch (error) {
    console.error('Error submitting song:', error.response.data);
  }
}

async function getNextSong() {
  try {
    const response = await (await fetch('/next')).json();
    console.log('next song response', response);

    const metadata = response.metadata;
    console.log('next song metadata', metadata);
    if (!metadata) {
      console.log('No more songs in queue');
      return;
    }

    if (metadata.trackId === NEXT_SONG_METADATA.trackId) {
      return;
    }
    NEXT_SONG_METADATA = metadata;
    nextSongTitle.innerText = NEXT_SONG_METADATA.title;
    nextSongArtist.innerText = NEXT_SONG_METADATA.artist;
    nextSongAlbum.innerText = NEXT_SONG_METADATA.album;
    nextAlbumArt.src = NEXT_SONG_METADATA.artUrl;
    nextAlbumArt.alt = NEXT_SONG_METADATA.album;
  } catch (error) {
    console.error('Error getting next song:', error);
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

  getNextSong();
  setInterval(getNextSong, 10000);

  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => {
      handleReplayAudio();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      audioPlayer.pause();
    });
    navigator.mediaSession.setActionHandler('seekbackward', null);
    navigator.mediaSession.setActionHandler('seekforward', null);
  }
});
