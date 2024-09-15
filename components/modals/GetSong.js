import { useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Radio,
  Button,
  GroupBox,
  Hourglass,
} from "react95";
import { useAuth } from "@/contexts/AuthContext";
import { addSongToSpotifyPlaylist } from "../../services/api";
import styled from "styled-components";

const NotificationMessage = styled.div`
  color: ${({ theme }) => theme.progress};
  max-width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
  margin-top: 10px;
`;

const platformDisplayNames = {
  spotify: "Spotify",
  appleMusic: "Apple Music",
  deezer: "Deezer",
  tidal: "Tidal",
  amazonMusic: "Amazon Music",
};

const GetSong = ({ isOpen, onClose, urlForPlatform, trackId }) => {
  const [activePlatform, setActivePlatform] = useState("spotify");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { authState } = useAuth();

  if (!isOpen) return null;

  const handlePlatformChange = (e) => setActivePlatform(e.target.value);

  const handleOpen = () => {
    if (activePlatform) {
      window.open(urlForPlatform[activePlatform], "_blank");
    }
    onClose();
  };

  const handleAddSong = async () => {
    if (activePlatform && authState.linkedServices?.[activePlatform]) {
      setLoading(true);
      setMessage("");

      try {
        const response = await addSongToSpotifyPlaylist(trackId);
        setMessage(response.message);
        setTimeout(onClose, 3000);
      } catch (error) {
        console.error("Error adding song to playlist:", error);
        setMessage("Error adding song to playlist.");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredPlatforms = Object.keys(platformDisplayNames).filter(
    (platform) => urlForPlatform[platform],
  );

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <Window
          style={{
            width: "300px",
            height: "auto",
            zIndex: 1001,
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <WindowHeader>Get Song</WindowHeader>
          <WindowContent>
            <form>
              <GroupBox label="Platforms">
                {filteredPlatforms.map((platform) => (
                  <div key={platform}>
                    <Radio
                      value={platform}
                      label={platformDisplayNames[platform]}
                      checked={activePlatform === platform}
                      onChange={handlePlatformChange}
                    />
                  </div>
                ))}
              </GroupBox>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                {loading && <Hourglass size={32} />}
              </div>
              {message && <NotificationMessage>{message}</NotificationMessage>}
              <div style={{ marginTop: "20px" }}>
                <Button
                  onClick={handleAddSong}
                  disabled={
                    !authState.linkedServices?.[activePlatform] || loading
                  }
                  active={loading}
                >
                  Add
                </Button>
                <Button onClick={handleOpen}>Open</Button>
                <Button onClick={onClose}>Exit</Button>
              </div>
            </form>
          </WindowContent>
        </Window>
      </div>
    </>
  );
};

export default GetSong;
