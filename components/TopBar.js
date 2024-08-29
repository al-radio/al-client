import React from "react";
import { styled } from "styled-components";
import { Button, AppBar, Toolbar } from "react95";
import { useVisibility } from "@/contexts/VisibilityContext";

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
              Account
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
