document.addEventListener("DOMContentLoaded", () => {
  const audioElement = document.getElementById("audio-player");
  const songTitle = document.getElementById("song-title");
  const songArtist = document.getElementById("song-artist");
  const songAlbum = document.getElementById("song-album");
  const albumArt = document.getElementById("album-art");

  async function updateSongInfo() {
    try {
      const response = await fetch("/song");
      if (!response.ok) throw new Error("Failed to fetch song metadata");

      const songData = await response.json();
      songTitle.textContent = songData.song.title;
      songArtist.textContent = `${songData.song.artist}`;
      songAlbum.textContent = `${songData.song.album}`;
      albumArt.src = songData.song.artUrl || 'default-album-art.png'; // Provide a default image if artUrl is missing
    } catch (error) {
      console.error("Error fetching song info:", error);
    }
  }

  // Initial fetch of song info
  updateSongInfo();

  // Poll for song info updates every 10 seconds
  setInterval(updateSongInfo, 10000);
});
