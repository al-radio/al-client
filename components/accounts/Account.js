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
} from "react95";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import {
  fetchProfile,
  login,
  register,
  fetchQueue,
  skipCurrentSong,
  submitQueueChanges,
} from "../../services/api";
import { useVisibility } from "@/contexts/VisibilityContext";
import ProfilePage from "./ProfilePage";
import HistoryPage from "./HistoryPage";
import styled from "styled-components";

// style the error message to use the same color as the theme
const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.progress};
  max-width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const windowId = "account";

const Account = () => {
  const [selectedTab, setSelectedTab] = useState("Profile");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [queueData, setQueueData] = useState("");
  const [queueType, setQueueType] = useState("");
  const [formData, setFormData] = useState({
    handle: "",
    password: "",
    email: "",
  });
  const { toggleVisibility } = useVisibility();

  const handleCloseButton = () => {
    toggleVisibility("account");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile(token)
        .then((profileData) => {
          setProfile(profileData);
        })
        .catch(() => {
          setProfile(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = () => {
    login(formData.handle, formData.password)
      .then((response) => {
        if (response.message) {
          setError(response.message);
          return;
        }
        localStorage.setItem("token", response.token);
        fetchProfile(response.token).then((profileData) => {
          setProfile(profileData);
        });
      })
      .catch(() => {
        setError("An error occurred during login. Please try again.");
      });
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
      .catch(() => {
        setError("An error occurred during registration. Please try again.");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    setError(null);
    setIsLoginView(true);
  };

  const handleFetchQueue = (type) => {
    fetchQueue(type)
      .then((data) => {
        setQueueData(JSON.stringify(data, null, 2));
        setQueueType(type);
      })
      .catch(() => {
        console.error("Failed to fetch queue data.");
      });
  };

  const handleSubmitQueueChanges = () => {
    if (!queueType) {
      console.error("No queue type selected.");
      return;
    }

    submitQueueChanges(queueType, queueData)
      .then((data) => {
        console.log(data);
      })
      .catch(() => {
        console.error("Failed to submit queue changes.");
      });
  };

  const handleSkipCurrentSong = () => {
    skipCurrentSong()
      .then((data) => {
        console.log(data);
      })
      .catch(() => {
        console.error("Failed to skip current song.");
      });
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

  const renderHistoryContent = () => {
    return <HistoryPage handle={profile.handle} />;
  };

  const renderDeveloperContent = () => {
    return (
      <div style={{ maxWidth: "500px" }}>
        <Button onClick={handleSkipCurrentSong}>Skip Current Song</Button>
        <Button onClick={() => handleFetchQueue("user")}>
          View User Queue
        </Button>
        <Button onClick={() => handleFetchQueue("suggestion")}>
          View Suggestion Queue
        </Button>
        <Button onClick={() => handleFetchQueue("audio")}>
          View Audio Queue
        </Button>

        <textarea
          value={queueData}
          onChange={(e) => setQueueData(e.target.value)}
          rows={10}
          style={{
            width: "100%",
            height: "200px",
            marginTop: "10px",
            fontFamily: "monospace",
            fontSize: "12px",
            whiteSpace: "pre",
            overflowX: "auto",
            overflowY: "auto",
          }}
        />

        <Button
          onClick={handleSubmitQueueChanges}
          style={{ marginTop: "10px" }}
        >
          Submit Changes
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Profile":
        return renderProfileContent();
      case "Requests":
        return renderHistoryContent();
      case "Developer":
        return renderDeveloperContent();
      default:
        return renderProfileContent();
    }
  };

  return (
    <ResponsiveWindowBase
      windowId={windowId}
      windowHeaderTitle="Account"
      defaultPosition={{ x: 200, y: 200 }}
    >
      <WindowContent>
        <Tabs value={selectedTab} onChange={(tab) => setSelectedTab(tab)}>
          <Tab value="Profile">Profile</Tab>
          {profile?.handle && <Tab value="Requests">Requests</Tab>}
          {profile?.role === "admin" && <Tab value="Developer">Developer</Tab>}
        </Tabs>
        <TabBody>{renderContent()}</TabBody>
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default Account;
