import { useCallback, useEffect, useState } from "react";
import {
  WindowContent,
  Button,
  Avatar,
  Slider,
  Toolbar,
  Hourglass,
} from "react95";
import { API_URL, fetchCurrentSong } from "../../services/api";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import ProfileAnchor from "../foundational/ProfileAnchor";
import GetSong from "../modals/GetSong";
import PausingMarquee from "../foundational/PausingMarqee";

// Function to detect iOS or iPadOS
const isIOSOrIPadOS = () => {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  }
};

const windowId = "audioPlayer";
const audioUrl = `${API_URL}/stream`;

const AudioPlayer = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(isIOSOrIPadOS());
  const [streamUrl, setStreamUrl] = useState(null);
  const { load, pause, setVolume, playing } = useGlobalAudioPlayer();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Forces stream to be live on play instead of playing from cache
  useEffect(() => {
    if (streamUrl) {
      setIsBuffering(true);
    }
    load(streamUrl || "about:", {
      autoplay: true,
      html5: true,
      format: "mp3",
    });
  }, [load, streamUrl]);

  const handleTuneIn = useCallback(() => {
    setStreamUrl(audioUrl + "?t=" + Date.now());
  }, []);

  const handleTuneOut = useCallback(() => {
    pause();
    setStreamUrl(null);
  }, [pause]);

  useEffect(() => {
    // detect iOS/iPadOS
    setIsIOSDevice(isIOSOrIPadOS());
  }, []);

  // Fetch current song every 10 seconds
  useEffect(() => {
    const currentSongEventSource = fetchCurrentSong();
    currentSongEventSource.onmessage = (event) => {
      const songData = JSON.parse(event.data);
      if (!currentSong || songData.title !== currentSong.title) {
        setCurrentSong(songData);
      }
    };

    return () => {
      currentSongEventSource.close();
    };
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
            src: currentSong.artUrl || "../../public/default-art.png",
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
    if (playing) {
      setIsBuffering(false);
    }
  }, [playing]);

  const handleVolumeChange = (value) => {
    setVolume(value / 100);
  };

  const handleGetSongClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ResponsiveWindowBase
      windowId={windowId}
      windowHeaderTitle="Now Playing"
      defaultPosition={{ x: 840, y: 400 }}
    >
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
              width: "100%",
              maxWidth: 600,
            }}
          >
            <div style={{ flex: 1 }}>
              {currentSong?.title ? (
                <>
                  <PausingMarquee text={currentSong.title} sizeLimit={30} />
                  <br />
                  <PausingMarquee text={currentSong.artist} sizeLimit={30} />
                  <br />
                  <PausingMarquee text={currentSong.album} sizeLimit={30} />
                  <p>
                    Requested by:{" "}
                    {currentSong.userSubmittedId ? (
                      <ProfileAnchor handle={currentSong.userSubmittedId} />
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: 16,
              }}
            >
              <Slider
                min={0}
                max={100}
                defaultValue={75}
                onChange={handleVolumeChange}
                disabled={isIOSDevice}
                style={{ marginBottom: 8 }}
              />
              <Button
                onClick={handleGetSongClick}
                disabled={!currentSong}
                style={{ whiteSpace: "nowrap" }}
              >
                Get Song
              </Button>
            </div>
          </div>
          {isBuffering && <Hourglass size={32} />}
        </div>
        <div style={{ flex: 1 }}></div>
        <Toolbar style={{ display: "flex", padding: 8 }}>
          <Button
            onClick={handleTuneIn}
            active={playing}
            disabled={playing}
            style={{ flex: 1, marginRight: 4, whiteSpace: "nowrap" }}
          >
            Tune In
          </Button>
          <Button
            onClick={handleTuneOut}
            active={!playing}
            disabled={!playing}
            style={{ flex: 1, marginLeft: 4, whiteSpace: "nowrap" }}
          >
            Tune Out
          </Button>
        </Toolbar>
      </WindowContent>

      {isModalOpen && (
        <GetSong
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          urlForPlatform={currentSong?.urlForPlatform}
          trackId={currentSong?.trackId}
        />
      )}
    </ResponsiveWindowBase>
  );
};

export default AudioPlayer;
