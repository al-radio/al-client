import { useState } from "react";
import {
  Button,
  TextInput,
  Window,
  WindowHeader,
  WindowContent,
  Hourglass,
} from "react95";
import { API_URL, submitSongRequest } from "../services/api";
import ResponsiveLayout from "./ResponsiveLayout";
import { useVisibility } from "@/contexts/VisibilityContext";

const SubmitSong = () => {
  const [query, setQuery] = useState("");
  const [trackId, setTrackId] = useState("");
  const [songMetadata, setSongMetadata] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toggleVisibility } = useVisibility();

  const handleCloseButton = () => {
    toggleVisibility("submitSong");
  };

  const handleQueryChange = (e) => setQuery(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await submitSongRequest(query);
      if (result.metadata) {
        setSongMetadata(result.metadata);
        setIsConfirming(true);
        setTrackId(result.metadata.trackId);
      } else if (result.success) {
        setQuery("");
        setSongMetadata(null);
        setIsConfirming(false);
        setNotification("Song submitted successfully!");
        setTimeout(() => setNotification(""), 5000);
      } else {
        setQuery("");
        setSongMetadata(null);
        setIsConfirming(false);
        setNotification(result.message);
        setTimeout(() => setNotification(""), 5000);
      }
    } catch (error) {
      console.error("Error submitting song:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true); // Start loading
    try {
      const result = await submitSongRequest(trackId);
      if (result.success) {
        setNotification("Song confirmed successfully!");
        setTimeout(() => setNotification(""), 5000);
      } else {
        setQuery("");
        setNotification(result.message);
        setTimeout(() => setNotification(""), 5000);
      }
    } catch (error) {
      console.error("Error confirming song:", error);
      setNotification("Error confirming song. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }

    setQuery("");
    setTrackId("");
    setSongMetadata(null);
    setIsConfirming(false);
  };

  const handleCancel = () => {
    setIsConfirming(false);
    setNotification("Song submission canceled.");
    setTimeout(() => setNotification(""), 5000);
  };

  return (
    <ResponsiveLayout
      uniqueKey="submitSong"
      defaultPosition={{ x: 1200, y: 170 }}
    >
      <Window>
        <WindowHeader
          className="window-header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>Request Song</span>
          <Button onClick={handleCloseButton}>
            <span className="close-icon" />
          </Button>
        </WindowHeader>
        <WindowContent>
          <div style={{ display: "flex" }}>
            <TextInput
              value={query}
              onChange={handleQueryChange}
              placeholder="Search for a song..."
              fullWidth
            />
            <Button onClick={handleSubmit} type="submit" disabled={isLoading}>
              Request
            </Button>
          </div>
          {isLoading && (
            <Hourglass size={25} style={{ marginTop: 10, marginLeft: 10 }} />
          )}
          {isConfirming && songMetadata && (
            <div>
              <h3>Confirm Song</h3>
              <p>Title: {songMetadata.title}</p>
              <p>Artist: {songMetadata.artist}</p>
              <p>Album: {songMetadata.album}</p>
              <Button onClick={() => handleConfirm()}>Confirm</Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          )}
          {notification && (
            <div style={{ marginTop: 10, color: "magenta" }}>
              {notification}
            </div>
          )}
        </WindowContent>
      </Window>
    </ResponsiveLayout>
  );
};

export default SubmitSong;
