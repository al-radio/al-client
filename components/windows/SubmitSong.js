import { useState } from "react";
import { Button, TextInput, WindowContent, Hourglass, Avatar } from "react95";
import { submitSongRequest } from "../../services/api";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import styled from "styled-components";

const NotificationMessage = styled.div`
  color: ${({ theme }) => theme.progress};
  max-width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
  margin-top: 10px;
`;

const ButtonContainer = styled.div`
  display: inline-block;
  button {
    margin-right: 5px;
  }
`;

const windowId = "submitSong";

const SubmitSong = () => {
  const [query, setQuery] = useState("");
  const [trackId, setTrackId] = useState("");
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (e) => setQuery(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await submitSongRequest(query);
      if (result.tracks && result.tracks.length > 0) {
        setTracks(result.tracks);
        setIsConfirming(true);
        setCurrentTrackIndex(0);
        setTrackId(result.tracks[0].trackId);
      } else if (result.queueLength) {
        setQuery("");
        setTracks([]);
        setIsConfirming(false);
        setNotification(
          `Success! Your song is ${result.queueLength} plays away!`,
        );
        setTimeout(() => setNotification(""), 5000);
      } else {
        setQuery("");
        setTracks([]);
        setIsConfirming(false);
        setNotification(result.message);
        setTimeout(() => setNotification(""), 5000);
      }
    } catch (error) {
      console.error("Error submitting song:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await submitSongRequest(trackId);
      if (result.queueLength) {
        setNotification(
          `Success! Your song is ${result.queueLength} plays away!`,
        );
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
      setIsLoading(false);
    }

    setQuery("");
    setTrackId("");
    setTracks([]);
    setIsConfirming(false);
  };

  const handleCancel = () => {
    setIsConfirming(false);
    setQuery("");
    setNotification("Song submission canceled.");
    setTimeout(() => setNotification(""), 5000);
  };

  const handleNextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setTrackId(tracks[currentTrackIndex + 1].trackId);
    }
  };

  const handlePreviousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setTrackId(tracks[currentTrackIndex - 1].trackId);
    }
  };

  return (
    <ResponsiveWindowBase windowId={windowId} windowHeaderTitle="Request Song">
      <WindowContent>
        <div style={{ display: "flex" }}>
          <TextInput
            value={query}
            onChange={handleQueryChange}
            placeholder="Search for a song..."
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSubmit(e);
              }
            }}
          />
          <Button onClick={handleSubmit} type="submit" disabled={isLoading}>
            Request
          </Button>
        </div>
        {isLoading && (
          <Hourglass size={25} style={{ marginTop: 10, marginLeft: 10 }} />
        )}
        {isConfirming && tracks.length > 0 && (
          <div style={{ display: "flex", marginTop: 10, gap: "10px" }}>
            <Avatar src={tracks[currentTrackIndex].artUrl} square size={110} />
            <div>
              <h3>{tracks[currentTrackIndex].title}</h3>
              <p>{tracks[currentTrackIndex].artist}</p>
              <p>{tracks[currentTrackIndex].album}</p>
              <ButtonContainer>
                <Button
                  onClick={handlePreviousTrack}
                  disabled={currentTrackIndex === 0}
                >
                  ←
                </Button>
                <Button onClick={handleConfirm}>Confirm</Button>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                  onClick={handleNextTrack}
                  disabled={currentTrackIndex === tracks.length - 1}
                >
                  →
                </Button>
              </ButtonContainer>
            </div>
          </div>
        )}
        {notification && (
          <NotificationMessage>{notification}</NotificationMessage>
        )}
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default SubmitSong;
