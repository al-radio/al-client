import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  WindowContent,
  Button,
  Hourglass,
  Anchor,
  TabBody,
} from "react95";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import ProfilePage from "../social_pages/ProfilePage";
import { fetchProfile, logout, fetchPublicProfile } from "../../services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useProfiles } from "@/contexts/ProfilesContext";
import SearchPage from "../social_pages/SearchPage";
import AuthPage from "../social_pages/AuthPage"; // Import the new AuthPage component

const Social = () => {
  const [selectedTab, setSelectedTab] = useState("Profile");
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authState, resetAuthState } = useAuth();
  const { profiles, removeProfile } = useProfiles();
  const [selectedProfileData, setSelectedProfileData] = useState(null);

  useEffect(() => {
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

  useEffect(() => {
    if (profiles.length > 0) {
      setSelectedTab(profiles[profiles.length - 1].handle);
    }
  }, [profiles]);

  // Fetch the profile on mount
  useEffect(() => {
    fetchProfile()
      .then((profileData) => setUserProfile(profileData))
      .catch(() => setUserProfile(null))
      .finally(() => setIsLoading(false));
  }, [authState]);

  const handleLogout = () => {
    logout().then(() => {
      resetAuthState();
      setUserProfile(null);
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

    return <AuthPage />;
  };

  const renderSearchTab = () => {
    return <SearchPage />;
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
                  const nextTab =
                    currentIndex === 0
                      ? "Profile"
                      : profiles[currentIndex - 1].handle;
                  setSelectedTab(nextTab);
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
    <ResponsiveWindowBase windowId={"social"} windowHeaderTitle="Social">
      <WindowContent>
        <Tabs
          value={selectedTab}
          rows={Math.floor((4 + profiles.length) / 6) + 1}
          onChange={(tab) => setSelectedTab(tab)}
        >
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
