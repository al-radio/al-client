import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  WindowContent,
  Button,
  Hourglass,
  Anchor,
  TextInput,
  TabBody,
  GroupBox,
} from "react95";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import ProfilePage from "../accounts/ProfilePage";
import HistoryPage from "../accounts/HistoryPage";
import styled from "styled-components";
import { fetchProfile, login, register, logout } from "../../services/api";
import { useAuth } from "@/contexts/AuthContext";

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.progress};
  max-width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const Social = () => {
  const [selectedTab, setSelectedTab] = useState("Profile");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [openedProfiles, setOpenedProfiles] = useState([]);
  const [formData, setFormData] = useState({
    handle: "",
    password: "",
    email: "",
  });
  const { setAuthStateFromProfile, resetAuthState } = useAuth();

  // Fetch the profile on mount
  useEffect(() => {
    fetchProfile()
      .then((profileData) => setProfile(profileData))
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogin = () => {
    login(formData.handle, formData.password)
      .then((response) => {
        if (response.message) {
          setError(response.message);
          return;
        }
        fetchProfile().then((profileData) => {
          setProfile(profileData);
          setAuthStateFromProfile(profileData);
        });
      })
      .catch(() =>
        setError("An error occurred during login. Please try again."),
      );
  };

  const handleRegister = () => {
    register(formData.email, formData.handle, formData.password)
      .then((response) => {
        if (response.message) {
          setError(response.message);
          return;
        }
        setIsLoginView(true);
        setError(null);
      })
      .catch(() =>
        setError("An error occurred during registration. Please try again."),
      );
  };

  const handleLogout = () => {
    logout().then(() => {
      resetAuthState();
      setProfile(null);
      setError(null);
      setIsLoginView(true);
    });
  };

  const openUserProfile = (userProfile) => {
    setOpenedProfiles((prevProfiles) => [...prevProfiles, userProfile]);
  };

  const closeUserProfile = (handle) => {
    setOpenedProfiles((prevProfiles) =>
      prevProfiles.filter((profile) => profile.handle !== handle),
    );
  };

  const renderProfileContent = () => {
    if (isLoading) {
      return <Hourglass size={32} />;
    }

    if (profile?.handle) {
      return (
        <>
          <ProfilePage profile={profile} />
          <Button onClick={handleLogout} style={{ marginTop: "10px" }}>
            Logout
          </Button>
        </>
      );
    }

    return (
      <>
        {error && (
          <ErrorMessage>
            <p>{error}</p>
          </ErrorMessage>
        )}
        {isLoginView ? (
          <>
            <TextInput
              value={formData.handle}
              onChange={(e) =>
                setFormData({ ...formData, handle: e.target.value })
              }
              placeholder="Handle"
            />
            <TextInput
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
            />
            <Button onClick={handleLogin}>Login</Button>
            <p
              onClick={() => {
                setError(null);
                setIsLoginView(false);
              }}
            >
              Need an account? <Anchor>Register here</Anchor>
            </p>
          </>
        ) : (
          <>
            <TextInput
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
            />
            <TextInput
              value={formData.handle}
              onChange={(e) =>
                setFormData({ ...formData, handle: e.target.value })
              }
              placeholder="Handle"
            />
            <TextInput
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
            />
            <Button onClick={handleRegister}>Register</Button>
            <p
              onClick={() => {
                setError(null);
                setIsLoginView(true);
              }}
            >
              Already have an account? <Anchor>Login here</Anchor>
            </p>
          </>
        )}
      </>
    );
  };

  const renderSearchTab = () => {
    return (
      <div>
        <TextInput placeholder="Search for a user..." />
        <Button onClick={() => openUserProfile({ handle: "searchedUser" })}>
          Search
        </Button>
      </div>
    );
  };

  const renderFriendsTab = () => {
    return <p>Coming Soon</p>;
  };

  const renderGlobalChatTab = () => {
    return <p>Coming Soon</p>;
  };

  const renderUserProfileTabs = () => {
    return openedProfiles.map((profile) => (
      <Tab key={profile.handle} value={profile.handle}>
        {profile.handle}
        <Button onClick={() => closeUserProfile(profile.handle)}>X</Button>
      </Tab>
    ));
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Profile":
        return renderProfileContent();
      case "Search":
        return renderSearchTab();
      case "Friends":
        return renderFriendsTab();
      case "Global Chat":
        return renderGlobalChatTab();
      default:
        return (
          <ProfilePage
            profile={openedProfiles.find((p) => p.handle === selectedTab)}
          />
        );
    }
  };

  return (
    <ResponsiveWindowBase
      windowId={"social"}
      windowHeaderTitle="Social"
      defaultPosition={{ x: 200, y: 200 }}
    >
      <WindowContent>
        <Tabs value={selectedTab} onChange={(tab) => setSelectedTab(tab)}>
          <Tab value="Profile">Profile</Tab>
          <Tab value="Search">Search</Tab>
          <Tab value="Friends">Friends</Tab>
          <Tab value="Global Chat">Global Chat</Tab>
          {renderUserProfileTabs()}
        </Tabs>
        <TabBody>{renderContent()}</TabBody>
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default Social;
