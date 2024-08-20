import { useEffect, useState } from "react";
import { Window, WindowHeader, WindowContent, Avatar } from "react95";
import { fetchNextSong } from "../services/api"; // Ensure this function exists in your api service

const NextSong = () => {
  const [nextSong, setNextSong] = useState(null);

  useEffect(() => {
    const getNextSong = async () => {
      try {
        const songData = await fetchNextSong();
        setNextSong(songData);
      } catch (error) {
        console.error("Error fetching next song:", error);
      }
    };

    getNextSong();
    setInterval(getNextSong, 10000);
  }, []);

  return (
    <Window>
      <WindowHeader>Next Song</WindowHeader>
      <WindowContent>
        {nextSong?.title ? (
          <>
            <Avatar square size={200} src={nextSong.artUrl} />
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
