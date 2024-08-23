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

// Styled component for menu list
const StyledMenuList = styled(MenuList)`
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 2000;
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
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
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
    <AppBar style={{ zIndex: "3000" }}>
      <Toolbar
        style={{ justifyContent: "space-between", position: "relative" }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <Button
            ref={buttonRef}
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            active={themeDropdownOpen}
          >
            Themes
          </Button>
          {themeDropdownOpen && (
            <StyledMenuList
              ref={menuRef}
              onClick={() => setThemeDropdownOpen(false)}
            >
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
  );
};

export default TopBar;
