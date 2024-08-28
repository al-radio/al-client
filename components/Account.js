import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Hourglass,
  Anchor,
  TextInput,
} from "react95";
import ResponsiveLayout from "./ResponsiveLayout";
import { fetchProfile, login, register } from "../services/api";

const Account = () => {
  const [selectedTab, setSelectedTab] = useState("Profile");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    handle: "",
    password: "",
    email: "",
  });

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
      .catch((err) => {
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
      .catch((err) => {
        setError("An error occurred during registration. Please try again.");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    setError(null);
    setIsLoginView(true);
  };

  const renderProfileContent = () => {
    if (isLoading) {
      return <Hourglass size={32} />;
    }

    if (profile?.handle) {
      return (
        <div>
          <div>
            <p>
              <strong>Handle:</strong> {profile.handle}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Bio:</strong> {profile.bio}
            </p>
            <p>
              <strong>Location:</strong> {profile.location}
            </p>
            <p>
              <strong>Favorite Song:</strong> {profile.favouriteSong}
            </p>
            <p>
              <strong>AL Thoughts:</strong> {profile.ALThoughts}
            </p>
            <p>
              <strong>Number of Songs Listened:</strong>{" "}
              {profile.numberOfSongsListened}
            </p>
            <p>
              <strong>Online Status:</strong>{" "}
              {profile.isOnline ? "Online" : "Offline"}
            </p>
            <p>
              <strong>Last Online:</strong>{" "}
              {new Date(profile.lastOnline).toLocaleString()}
            </p>
            <p>
              <strong>Account Created:</strong>{" "}
              {new Date(profile.createdDate).toLocaleString()}
            </p>
            <p>
              <strong>Email Verified:</strong>{" "}
              {profile.isEmailVerified ? "Yes" : "No"}
            </p>
            <p>
              <strong>Customization Preferences:</strong>
            </p>
            <ul>
              {profile.customizationPreferences &&
                Array.from(profile.customizationPreferences).map(
                  ([key, value]) => (
                    <li key={key}>
                      {key}: {JSON.stringify(value)}
                    </li>
                  ),
                )}
            </ul>
            <p>
              <strong>Linked Services:</strong>
            </p>
            <ul>
              {profile.linkedServices &&
                Array.from(profile.linkedServices).map(([service, url]) => (
                  <li key={service}>
                    {service}: <Anchor href={url}>{url}</Anchor>
                  </li>
                ))}
            </ul>
            <p>
              <strong>Friends:</strong>
            </p>
            <ul>
              {profile.friends &&
                profile.friends.map((friend) => (
                  <li key={friend.friendId}>
                    {friend.friendId} (Added:{" "}
                    {new Date(friend.dateAdded).toLocaleString()})
                  </li>
                ))}
            </ul>
          </div>
          <Button onClick={handleLogout} style={{ marginTop: "10px" }}>
            Logout
          </Button>
        </div>
      );
    }

    return (
      <div>
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
        {error && (
          <div
            style={{
              color: "red",
              maxWidth: "100%", // Ensures it doesn't extend beyond the container
              wordWrap: "break-word", // Allows wrapping of long words
              whiteSpace: "pre-wrap", // Maintains whitespace and wraps text
            }}
          >
            {error}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Profile":
        return renderProfileContent();
      case "History":
        return <div>Request History Content</div>;
      case "Friends":
        return <div>Friends Content</div>;
      default:
        return renderProfileContent();
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
