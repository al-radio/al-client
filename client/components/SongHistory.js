import { useEffect, useState } from 'react';
import { Window, WindowHeader, WindowContent } from 'react95';
import { fetchSongHistory } from '../services/api';
import { Image } from 'next/image';

const SongHistory = () => {
  const [songHistory, setSongHistory] = useState([]);

  useEffect(() => {
    const getSongHistory = async () => {
      try {
        const historyData = await fetchSongHistory();
        setSongHistory(historyData);
      } catch (error) {
        console.error('Error fetching song history:', error);
      }
    };

    getSongHistory();
    const historyIntervalId = setInterval(getSongHistory, 10000);
    return () => clearInterval(historyIntervalId);
  }, []);

  return (
    <Window style={{ width: 300, height: 250 }}>
      <WindowHeader>Song History</WindowHeader>
      <WindowContent>
        <ul>
          {songHistory.length > 0 ? (
            songHistory.map((song, index) => (
              <li key={index}>
                <Image src={song.artUrl} alt={song.album} style={{ width: 50, height: 50 }} />
                <strong>{song.title}</strong> by {song.artist} ({song.album})
              </li>
            ))
          ) : (
            <p>No history available.</p>
          )}
        </ul>
      </WindowContent>
    </Window>
  );
};

export default SongHistory;
