import { useEffect, useState } from 'react'; // Import useState and useEffect
import { Window, WindowHeader, WindowContent } from 'react95';
import styled from 'styled-components';
import { API_URL, fetchCurrentSong } from '../services/api';

const AlbumArt = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const AudioPlayer = () => {
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const getCurrentSong = async () => {
      try {
        const songData = await fetchCurrentSong();
        setCurrentSong(songData);
      } catch (error) {
        console.error('Error fetching current song:', error);
      }
      // Timer to check for a new song every 10 seconds
      const intervalId = setInterval(getCurrentSong, 10000);

      // Cleanup on component unmount
      return () => clearInterval(intervalId);
    };

    getCurrentSong();
  }, []);

  const audioUrl = `${API_URL}/stream`;

  if (!currentSong) {
    return (
      <Window style={{ width: 300, height: 250 }}>
        <WindowHeader>Audio Player</WindowHeader>
        <WindowContent>
          <p>Loading song data...</p>
        </WindowContent>
      </Window>
    );
  }

  return (
    <Window style={{ width: 300, height: 250 }}>
      <WindowHeader>Audio Player</WindowHeader>
      <WindowContent>
        <AlbumArt src={currentSong.artUrl} alt={`${currentSong.album} album art`} />
        <h2>{currentSong.title}</h2>
        <p>{currentSong.artist}</p>
        <p>{currentSong.album}</p>
        <audio controls src={audioUrl} />
      </WindowContent>
    </Window>
  );
};

export default AudioPlayer;
