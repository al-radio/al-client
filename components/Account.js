import React, { useState } from "react";
import { Tabs, Tab, Window, WindowHeader, WindowContent } from "react95";
import ResponsiveLayout from "./ResponsiveLayout";

const Account = () => {
  const [selectedTab, setSelectedTab] = useState("Profile");

  const renderContent = () => {
    switch (selectedTab) {
      case "Profile":
        return <div>Profile Content</div>;
      case "History":
        return <div>Request History Content</div>;
      case "Friends":
        return <div>Friends Content</div>;
      default:
        return <div>Profile Content</div>;
    }
  };

  return (
    <ResponsiveLayout uniqueKey="account" defaultPosition={{ x: 200, y: 200 }}>
      <Window>
        <WindowHeader className="window-header">
          <span>Account</span>
        </WindowHeader>
        <WindowContent>
          <Tabs
            value={selectedTab}
            onChange={(tab) => setSelectedTab(tab)}
            style={{ marginBottom: "10px" }}
          >
            <Tab value="Profile">Profile</Tab>
            <Tab value="History">History</Tab>
            <Tab value="Friends">Friends</Tab>
          </Tabs>
          {renderContent()}
        </WindowContent>
      </Window>
    </ResponsiveLayout>
  );
};

export default Account;
