import { useEffect, useState } from 'react';
import { Window, WindowHeader, WindowContent } from 'react95';
import styled from 'styled-components';
import { API_URL, fetchCurrentSong } from '../services/api';
import { useGlobalAudioPlayer } from 'react-use-audio-player';

const AlbumArt = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const AudioPlayer = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioUrl = `${API_URL}/stream`;
  const { load } = useGlobalAudioPlayer();

  useEffect(() => {
    const getCurrentSong = async () => {
      try {
        const songData = await fetchCurrentSong();
        setCurrentSong(songData);
      } catch (error) {
        console.error('Error fetching current song:', error);
      }
      const intervalId = setInterval(getCurrentSong, 10000);
      return () => clearInterval(intervalId);
    };

    getCurrentSong();
  }, []);

  useEffect(() => {
    if (currentSong && 'mediaSession' in navigator) {
      const { mediaSession } = navigator;
      mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album,
        artwork: [
          {
            src: currentSong.artUrl,
            sizes: '100x100',
            type: 'image/png',
          },
        ],
      });
    }
  }, [currentSong]);


  const handlePlay = () => {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach((el) => el.remove());

    load(`${audioUrl}?t=${new Date().getTime()}`, {
      autoplay: true,
      html5: true,
      format: 'mp3',
      onpause: () => setIsPlaying(false),
    });
    setIsPlaying(true);
  };

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
        {!isPlaying && (
          <button onClick={handlePlay}>Play</button>
        )}
      </WindowContent>
    </Window>
  );
};

export default AudioPlayer;
