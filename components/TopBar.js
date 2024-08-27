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
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";

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
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false); // Add state for profile modal
  const [profile, setProfile] = useState(null); // Add state for profile data
  const menuRef = useRef(null);
  const themeButtonRef = useRef(null);
  const accountButtonRef = useRef(null);

  const { toggleTheme } = useTheme();

  const handleThemeChange = (themeName) => {
    toggleTheme(themeMap[themeName]);
    setThemeDropdownOpen(false);
  };

  const handleAccountClick = (action) => {
    if (action === "register") {
      setRegisterModalOpen(true);
    } else if (action === "login") {
      setLoginModalOpen(true);
    } else if (action === "profile") {
      // Fetch profile data here if needed
      fetchProfileData();
      setProfileModalOpen(true);
    }
    setAccountDropdownOpen(false);
  };

  const fetchProfileData = () => {
    // Simulate fetching profile data
    const fetchedProfile = {
      ALThoughts: "",
      avatarUrl: "https://via.placeholder.com/100",
      bio: "This is a sample bio.",
      favouriteSong: "Sample Song",
      handle: "greg",
      isOnline: false,
      location: "Sample Location",
      numberOfSongsListened: 0,
      createdDate: "2024-08-27T05:07:16.894Z",
      friends: [],
      lastOnline: "2024-08-27T05:07:16.894Z",
    };
    setProfile(fetchedProfile);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !(
          themeButtonRef.current &&
          themeButtonRef.current.contains(event.target)
        ) &&
        !(
          accountButtonRef.current &&
          accountButtonRef.current.contains(event.target)
        )
      ) {
        setThemeDropdownOpen(false);
        setAccountDropdownOpen(false);
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
          <div style={{ position: "relative", display: "inline-block" }}>
            <Button
              ref={accountButtonRef}
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              active={accountDropdownOpen}
              aria-expanded={accountDropdownOpen}
              aria-haspopup="true"
            >
              Account
            </Button>
            {accountDropdownOpen && (
              <StyledMenuList
                ref={menuRef}
                onClick={() => setAccountDropdownOpen(false)}
              >
                <MenuListItem onClick={() => handleAccountClick("register")}>
                  Create Account
                </MenuListItem>
                <MenuListItem onClick={() => handleAccountClick("login")}>
                  Login
                </MenuListItem>
                <MenuListItem onClick={() => handleAccountClick("profile")}>
                  View Profile
                </MenuListItem>
              </StyledMenuList>
            )}
          </div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Button
              ref={themeButtonRef}
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              active={themeDropdownOpen}
              aria-expanded={themeDropdownOpen}
              aria-haspopup="true"
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
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
};

export default TopBar;
