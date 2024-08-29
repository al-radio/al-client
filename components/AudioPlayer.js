import { useCallback, useEffect, useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Avatar,
  Slider,
  Toolbar,
  Hourglass,
  Anchor,
} from "react95";
import { API_URL, fetchCurrentSong } from "../services/api";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import ResponsiveLayout from "./ResponsiveLayout";
import { useVisibility } from "@/contexts/VisibilityContext";

// Function to detect iOS or iPadOS
const isIOSOrIPadOS = () => {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  }
};

const AudioPlayer = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(isIOSOrIPadOS());
  const audioUrl = `${API_URL}/stream`;
  const { load, pause, setVolume, getPosition } = useGlobalAudioPlayer();
  const { toggleVisibility } = useVisibility();

  const handleCloseButton = () => {
    toggleVisibility("audioPlayer");
  };

  // Forces stream to be live on play instead of playing from cache
  const handlePlay = useCallback(() => {
    setIsBuffering(true);
    load(`${audioUrl}?t=${new Date().getTime()}`, {
      autoplay: true,
      html5: true,
      format: "mp3",
    });
  }, [load, audioUrl]);

  const handleTuneIn = useCallback(() => {
    handlePlay();
    setIsPlaying(true);
  }, [handlePlay]);

  const handleTuneOut = useCallback(() => {
    pause();
    setIsPlaying(false);
    setIsBuffering(false);
  }, [pause]);

  useEffect(() => {
    // detect iOS/iPadOS
    setIsIOSDevice(isIOSOrIPadOS());
  }, []);

  // Fetch current song every 10 seconds
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
    const intervalId = setInterval(getCurrentSong, 10000);
    return () => clearInterval(intervalId);
  }, [currentSong]);

  // Update media session metadata when current song changes
  useEffect(() => {
    if (currentSong && "mediaSession" in navigator) {
      const { mediaSession } = navigator;
      mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album,
        artwork: [
          {
            src: currentSong.artUrl,
            sizes: "100x100",
            type: "image/png",
          },
        ],
      });
      mediaSession.setActionHandler("play", handleTuneIn);
      mediaSession.setActionHandler("pause", handleTuneOut);
      mediaSession.setActionHandler("previoustrack", null);
      mediaSession.setActionHandler("nexttrack", null);
      mediaSession.setActionHandler("seekbackward", null);
      mediaSession.setActionHandler("seekforward", null);
    }
  }, [currentSong, handleTuneIn, handleTuneOut]);

  // Buffering effect when starting to play
  useEffect(() => {
    if (isPlaying) {
      const hasBuffered = () => {
        if (getPosition() > 0) {
          setIsBuffering(false);
        }
      };

      const bufferCheck = setInterval(hasBuffered, 1000);
      return () => clearInterval(bufferCheck);
    }
  }, [isPlaying, getPosition]);

  const handleVolumeChange = (value) => {
    setVolume(value / 100);
  };

  return (
    <ResponsiveLayout
      uniqueKey="audioPlayer"
      defaultPosition={{ x: 840, y: 400 }}
    >
      <Window>
        <WindowHeader
          className="window-header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>Now Playing</span>
          <Button onClick={handleCloseButton}>
            <span className="close-icon" />
          </Button>
        </WindowHeader>
        <WindowContent
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                aspectRatio: "1", // Maintains 1:1 aspect ratio
              }}
            >
              <Avatar
                square
                src={currentSong?.artUrl}
                style={{
                  width: "100%",
                  height: "auto", // Maintain aspect ratio
                  display: "block",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                {currentSong?.title ? (
                  <>
                    <h2>{currentSong.title}</h2>
                    <p>{currentSong.artist}</p>
                    <p>{currentSong.album}</p>
                    <p>
                      Requested by:{" "}
                      {currentSong.userSubmittedId ? (
                        <Anchor>{currentSong.userSubmittedId}</Anchor>
                      ) : (
                        "AL"
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <h2>Not Playing</h2>
                    <p>Not Playing</p>
                    <p>Not Playing</p>
                  </>
                )}
              </div>
              <div style={{ width: 150, marginLeft: 16 }}>
                <Slider
                  min={0}
                  max={100}
                  defaultValue={75}
                  onChange={handleVolumeChange}
                  disabled={isIOSDevice}
                />
              </div>
            </div>
            {isBuffering && <Hourglass size={32} />}
          </div>
          <div style={{ flex: 1 }}></div>
          <Toolbar style={{ display: "flex", padding: 8 }}>
            <Button
              onClick={handleTuneIn}
              active={isPlaying}
              disabled={isPlaying}
              style={{ flex: 1, marginRight: 4 }}
            >
              Tune In
            </Button>
            <Button
              onClick={handleTuneOut}
              active={!isPlaying}
              disabled={!isPlaying}
              style={{ flex: 1, marginLeft: 4 }}
            >
              Tune Out
            </Button>
          </Toolbar>
        </WindowContent>
      </Window>
    </ResponsiveLayout>
  );
};

export default AudioPlayer;
