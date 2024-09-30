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
import styled from "styled-components";
import {
  fetchProfile,
  login,
  register,
  logout,
  fetchPublicProfile,
} from "../../services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useProfiles } from "@/contexts/ProfilesContext";

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.progress};
  max-width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const Social = () => {
  const [selectedTab, setSelectedTab] = useState("Profile");
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    handle: "",
    password: "",
    email: "",
  });
  const { setAuthStateFromProfile, resetAuthState } = useAuth();
  const { profiles, removeProfile, addProfile } = useProfiles();
  const [selectedProfileData, setSelectedProfileData] = useState(null);

  useEffect(() => {
    // fetch the selected profile
    if (
      selectedTab !== "Profile" &&
      selectedTab !== "Search" &&
      selectedTab !== "Friends" &&
      selectedTab !== "Chat"
    ) {
      fetchPublicProfile(selectedTab)
        .then((profileData) => {
          setSelectedProfileData(profileData);
        })
        .catch(() => {
          setSelectedProfileData(null);
        });
    }
  }, [selectedTab]);

  // Fetch the profile on mount
  useEffect(() => {
    fetchProfile()
      .then((profileData) => setUserProfile(profileData))
      .catch(() => setUserProfile(null))
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
          setUserProfile(profileData);
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
      setUserProfile(null);
      setError(null);
      setIsLoginView(true);
    });
  };

  const renderProfileContent = () => {
    if (isLoading) {
      return <Hourglass size={32} />;
    }

    if (userProfile?.handle) {
      return (
        <>
          <ProfilePage profile={userProfile} />
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
    return <div>Coming Soon</div>;
  };

  const renderFriendsTab = () => {
    return <p>Coming Soon</p>;
  };

  const renderGlobalChatTab = () => {
    return <p>Coming Soon</p>;
  };

  const renderUserProfileTabs = () => {
    return profiles.map((profile) => (
      <Tab key={profile.handle} value={profile.handle}>
        {profile.handle}
      </Tab>
    ));
  };

  const renderProfileTabContent = () => {
    return profiles.map((profile) => (
      <div key={profile.handle}>
        {/* Fetch the profile data for the selected profile */}
        {selectedProfileData &&
          selectedProfileData.handle === profile.handle && (
            <div>
              <ProfilePage profile={selectedProfileData} />
              <Button
                onClick={() => {
                  removeProfile(profile.handle);
                  const currentIndex = profiles.findIndex(
                    (p) => p.handle === profile.handle,
                  );
                  const nextIndex = currentIndex === 0 ? 0 : currentIndex - 1;
                  setSelectedTab(profiles[nextIndex]?.handle || "Profile");
                }}
                style={{ marginTop: "10px" }}
              >
                Close Profile
              </Button>
            </div>
          )}
      </div>
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
      case "Chat":
        return renderGlobalChatTab();
      default:
        return renderProfileTabContent();
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
          <Tab value="Chat">Chat</Tab>
          {renderUserProfileTabs()}
        </Tabs>
        <TabBody>{renderContent()}</TabBody>
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default Social;
