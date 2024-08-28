import React, { useRef, useEffect, useState } from "react";
import { styled } from "styled-components";
import { Button, AppBar, MenuList, MenuListItem, Toolbar } from "react95";
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

const TopBar = ({
  onToggleComponent,
  componentVisibility: {
    isAudioPlayerVisible,
    isSongHistoryVisible,
    isNextSongVisible,
    isSubmitSongVisible,
    isListenerCountVisible,
    isAccountVisible,
  },
}) => {
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
  const menuRef = useRef(null);
  const themeButtonRef = useRef(null);
  const accountButtonRef = useRef(null);

  const { toggleTheme } = useTheme();

  const handleThemeChange = (themeName) => {
    toggleTheme(themeMap[themeName]);
    setThemeDropdownOpen(false);
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
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              active={isAccountVisible}
              onClick={() => onToggleComponent("Account")}
            >
              Account
            </Button>
            <Button
              active={isAudioPlayerVisible}
              onClick={() => onToggleComponent("AudioPlayer")}
            >
              Player
            </Button>
            <Button
              active={isSongHistoryVisible}
              onClick={() => onToggleComponent("SongHistory")}
            >
              History
            </Button>
            <Button
              active={isNextSongVisible}
              onClick={() => onToggleComponent("NextSong")}
            >
              Up Next
            </Button>
            <Button
              active={isSubmitSongVisible}
              onClick={() => onToggleComponent("SubmitSong")}
            >
              Request Song
            </Button>
            <Button
              active={isListenerCountVisible}
              onClick={() => onToggleComponent("ListenerCount")}
            >
              Listeners
            </Button>
          </div>
          <div style={{ display: "flex", gap: "10px", position: "relative" }}>
            <Button
              ref={themeButtonRef}
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              active={themeDropdownOpen}
            >
              Theme
            </Button>
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
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopBar;
