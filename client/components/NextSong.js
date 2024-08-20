import { useEffect, useState } from 'react';
import { Window, WindowHeader, WindowContent } from 'react95';
import { fetchNextSong } from '../services/api'; // Ensure this function exists in your api service
import styled from 'styled-components';

const AlbumArt = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const NextSong = () => {
  const [nextSong, setNextSong] = useState(null);

  useEffect(() => {
    const getNextSong = async () => {
      try {
        const songData = await fetchNextSong();
        setNextSong(songData);
      } catch (error) {
        console.error('Error fetching next song:', error);
      }
    };

    getNextSong();
    const nextSongIntervalId = setInterval(getNextSong, 10000);
    return () => clearInterval(nextSongIntervalId);
  }, []);

  return (
    <Window style={{ width: 300, height: 250 }}>
      <WindowHeader>Next Song</WindowHeader>
      <WindowContent>
        {nextSong ? (
          <>
            <AlbumArt src={nextSong.artUrl} alt={`${nextSong.album} album art`} />
            <h2>{nextSong.title}</h2>
            <p>{nextSong.artist}</p>
            <p>{nextSong.album}</p>
          </>
        ) : (
          <p>Loading next song...</p>
        )}
      </WindowContent>
    </Window>
  );
};

export default NextSong;
