import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { Button, AppBar, Toolbar, Avatar } from "react95";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomization } from "@/contexts/CustomizationContext";

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
  const { customization, toggleVisibility } = useCustomization();
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
              active={customization.social?.isVisible}
              onClick={() => handleToggleComponent("social")}
            >
              {handle && (
                <Avatar size={24} src={avatarUrl} style={{ marginRight: 8 }} />
              )}
              {handle || "Social"}
            </Button>
            <Button
              active={customization.customize?.isVisible}
              onClick={() => handleToggleComponent("customize")}
            >
              Customize
            </Button>
            <Button
              active={customization.audioPlayer?.isVisible}
              onClick={() => handleToggleComponent("audioPlayer")}
            >
              Player
            </Button>
            <Button
              active={customization.songHistory?.isVisible}
              onClick={() => handleToggleComponent("songHistory")}
            >
              History
            </Button>
            <Button
              active={customization.nextSong?.isVisible}
              onClick={() => handleToggleComponent("nextSong")}
            >
              Up Next
            </Button>
            <Button
              active={customization.submitSong?.isVisible}
              onClick={() => handleToggleComponent("submitSong")}
            >
              Request Song
            </Button>
            <Button
              active={customization.listeners?.isVisible}
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
