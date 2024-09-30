import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { Button, AppBar, Toolbar, Avatar } from "react95";
import { useVisibility } from "@/contexts/VisibilityContext";
import { fetchProfile } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

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
  const { authState } = useAuth();
  const [handle, setHandle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    setHandle(authState.handle);
    setAvatarUrl(authState.avatarUrl);
  }, [authState]);

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
              active={visibility.social}
              onClick={() => handleToggleComponent("social")}
            >
              Social
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
