import { useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Radio,
  Button,
  GroupBox,
} from "react95";

const platformDisplayNames = {
  spotify: "Spotify",
  appleMusic: "Apple Music",
  deezer: "Deezer",
  tidal: "Tidal",
  amazonMusic: "Amazon Music",
};

const GetSong = ({ isOpen, onClose, urlForPlatform }) => {
  const [activePlatform, setActivePlatform] = useState("spotify");

  if (!isOpen) return null;

  const handlePlatformChange = (e) => setActivePlatform(e.target.value);

  const handleOpen = () => {
    if (activePlatform) {
      window.open(urlForPlatform[activePlatform], "_blank");
      onClose();
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
              <div style={{ marginTop: "20px" }}>
                <Button onClick={handleOpen} style={{ marginRight: "10px" }}>
                  Open
                </Button>
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
