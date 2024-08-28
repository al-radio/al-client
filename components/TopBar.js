import React, { useRef, useEffect, useState } from "react";
import { styled } from "styled-components";
import { Button, AppBar, MenuList, MenuListItem, Toolbar } from "react95";
import {
  useVisibility,
  VisibilityProvider,
} from "@/contexts/VisibilityContext";
import { useTheme } from "@/contexts/ThemeContext";
import original from "react95/dist/themes/original";
import spruce from "react95/dist/themes/spruce";
import vaporTeal from "react95/dist/themes/vaporTeal";
import highContrast from "react95/dist/themes/highContrast";
import lilac from "react95/dist/themes/lilac";
import maple from "react95/dist/themes/maple";
import pamelaAnderson from "react95/dist/themes/pamelaAnderson";
import theSixtiesUSA from "react95/dist/themes/theSixtiesUSA";
import violetDark from "react95/dist/themes/violetDark";
import candy from "react95/dist/themes/candy";

const StyledMenuList = styled(MenuList)`
  position: absolute;
  right: 0; /* Position the dropdown on the right side */
  top: 100%;
  z-index: 2000;
`;

const ScrollableToolbar = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto; /* Enable horizontal scrolling */
  white-space: nowrap; /* Prevent wrapping of buttons */
  padding: 0 10px; /* Add some padding to the container */
`;

const TopBar = () => {
  const themeMap = {
    Original: original,
    Candy: candy,
    Spruce: spruce,
    "Vapor Teal": vaporTeal,
    "High Contrast": highContrast,
    Lilac: lilac,
    Maple: maple,
    "Blind Pink": pamelaAnderson,
    "The Sixties": theSixtiesUSA,
    "Violet Dark": violetDark,
  };

  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const { visibility, toggleVisibility } = useVisibility();
  const menuRef = useRef(null);
  const themeButtonRef = useRef(null);

  const { toggleTheme } = useTheme();

  const handleThemeChange = (themeName) => {
    toggleTheme(themeMap[themeName]);
    setThemeDropdownOpen(false);
  };

  const handleToggleComponent = (component) => {
    toggleVisibility(component);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !themeButtonRef.current.contains(event.target)
      ) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <Button ref={themeButtonRef} active={themeDropdownOpen}>
              Theme
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
          {themeDropdownOpen && (
            <StyledMenuList ref={menuRef}>
              {Object.keys(themeMap).map((theme) => (
                <MenuListItem
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                >
                  {theme}
                </MenuListItem>
              ))}
            </StyledMenuList>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopBar;
