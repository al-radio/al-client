import React, { useState, useEffect } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Tabs,
  Tab,
  TabBody,
} from "react95";
import ProfilePage from "../accounts/ProfilePage";
import HistoryPage from "../accounts/HistoryPage";
import { fetchPublicProfile } from "@/services/api";
import { useIsMobile } from "@/contexts/isMobileContext";

const ProfileModal = ({ isOpen, onClose, handle }) => {
  const [profile, setProfile] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Profile");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen && handle) {
      const fetchProfile = async () => {
        try {
          const userProfile = await fetchPublicProfile(handle);
          setProfile(userProfile);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      };

      fetchProfile();
    }
  }, [isOpen, handle]);

  if (!isOpen) return null;

  const renderProfileContent = () =>
    profile ? <ProfilePage profile={profile} /> : <div>Loading...</div>;

  const renderHistoryContent = () =>
    profile ? <HistoryPage handle={profile.handle} /> : <div>Loading...</div>;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <Window
        style={{
          zIndex: 1001,
          position: "relative",
          width: isMobile ? "100%" : "max(min-content, 400px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <WindowHeader>
          <span>{handle}</span>
        </WindowHeader>
        <WindowContent>
          <Tabs value={selectedTab} onChange={(tab) => setSelectedTab(tab)}>
            <Tab value="Profile">Profile</Tab>
            <Tab value="History">History</Tab>
          </Tabs>
          <TabBody>
            {selectedTab === "Profile" && renderProfileContent()}
            {selectedTab === "History" && renderHistoryContent()}
          </TabBody>
          <Button onClick={onClose} style={{ marginTop: "10px" }}>
            Exit
          </Button>
        </WindowContent>
      </Window>
    </div>
  );
};

export default ProfileModal;
