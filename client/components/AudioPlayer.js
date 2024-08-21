import { useEffect, useState } from "react";
import { Window, WindowHeader, WindowContent, Button, Avatar } from "react95";
import { API_URL, fetchCurrentSong } from "../services/api";
import { useGlobalAudioPlayer } from "react-use-audio-player";

const AudioPlayer = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioUrl = `${API_URL}/stream`;
  const { load } = useGlobalAudioPlayer();

  useEffect(() => {
    const getCurrentSong = async () => {
      try {
        const songData = await fetchCurrentSong();
        if (songData.title !== currentSong?.title) {
          setCurrentSong(songData);
        }
      } catch (error) {
        console.error("Error fetching current song:", error);
      }
    };

    getCurrentSong();
    setInterval(getCurrentSong, 10000);
    return () => clearInterval(intervalId);
  });

  useEffect(() => {
    if (currentSong && "mediaSession" in navigator) {
      const { mediaSession } = navigator;
      mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album,
        artwork: [
          {
            src: currentSong.artUrl || "@public/album-art-placeholder.png",
            sizes: "100x100",
            type: "image/png",
          },
        ],
      });
    }
  }, [currentSong]);

  const handlePlay = () => {
    const audioElements = document.querySelectorAll("audio");
    audioElements.forEach((el) => el.remove());

    load(`${audioUrl}?t=${new Date().getTime()}`, {
      autoplay: true,
      html5: true,
      format: "mp3",
      onpause: () => setIsPlaying(false),
    });
    setIsPlaying(true);
  };
  return (
    <Window>
      <WindowHeader>Now Playing</WindowHeader>
      <WindowContent>
        {currentSong?.title ? (
          <>
            <Avatar square size={300} src={currentSong.artUrl} />
            <h2>{currentSong.title}</h2>
            <p>{currentSong.artist}</p>
            <p>{currentSong.album}</p>
          </>
        ) : (
          <p>Loading song data...</p>
        )}
        {!isPlaying ? (
          <Button onClick={handlePlay}>Start Listening</Button>
        ) : null}
      </WindowContent>
    </Window>
  );
};

export default AudioPlayer;
