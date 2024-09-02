import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { Button, AppBar, Toolbar, Avatar } from "react95";
import { useVisibility } from "@/contexts/VisibilityContext";
import { getHandleAndPictureFromToken } from "@/services/api";

const ScrollableToolbar = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto; /* Enable horizontal scrolling */
  overflow-y: hidden; /* Hide vertical scrolling */
  white-space: nowrap; /* Prevent wrapping of buttons */
  padding: 0 10px; /* Add some padding to the container */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TopBar = () => {
  const { visibility, toggleVisibility } = useVisibility();
  const [handle, setHandle] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { handle, avatarUrl } = await getHandleAndPictureFromToken();
        setHandle(handle);
        setAvatarUrl(avatarUrl);
      } catch (error) {
        console.error("Error fetching user data", error);
        setHandle(null);
        setAvatarUrl(null);
      }
    };

    // Fetch user data if token is present
    if (token) {
      fetchUserData();
    } else {
      setHandle(null);
      setAvatarUrl(null);
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = localStorage.getItem("token");
      if (newToken !== token) {
        setToken(newToken);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  const handleToggleComponent = (component) => {
    toggleVisibility(component);
  };

  return (
    <>
      <AppBar style={{ zIndex: "3000" }}>
        <Toolbar
          style={{ justifyContent: "space-between", position: "relative" }}
        >
          <ScrollableToolbar>
            <Button
              active={visibility.account}
              onClick={() => handleToggleComponent("account")}
            >
              {handle && (
                <Avatar size={24} src={avatarUrl} style={{ marginRight: 8 }} />
              )}
              {handle || "Account"}
            </Button>
            <Button
              active={visibility.customize}
              onClick={() => handleToggleComponent("customize")}
            >
              Customize
            </Button>
            <Button
              active={visibility.audioPlayer}
              onClick={() => handleToggleComponent("audioPlayer")}
            >
              Player
            </Button>
            <Button
              active={visibility.songHistory}
              onClick={() => handleToggleComponent("songHistory")}
            >
              History
            </Button>
            <Button
              active={visibility.nextSong}
              onClick={() => handleToggleComponent("nextSong")}
            >
              Up Next
            </Button>
            <Button
              active={visibility.submitSong}
              onClick={() => handleToggleComponent("submitSong")}
            >
              Request Song
            </Button>
            <Button
              active={visibility.listeners}
              onClick={() => handleToggleComponent("listeners")}
            >
              Listeners
            </Button>
          </ScrollableToolbar>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopBar;
