import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchProfile, API_URL } from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    handle: "",
    avatarUrl: "",
    linkedServices: {},
  });

  const updateAuthState = (newAuthState) => {
    setAuthState((prevState) => ({
      ...prevState,
      ...newAuthState,
    }));
  };

  const resetAuthState = () => {
    setAuthState({
      handle: "",
      avatarUrl: "",
      linkedServices: {},
    });
  };

  const setAuthStateFromProfile = (profileData) => {
    updateAuthState({
      handle: profileData.handle,
      avatarUrl: profileData.avatarUrl || `${API_URL}/avatars/default.png`,
      linkedServices: {
        spotify: profileData.spotifyUserId,
        lastFM: profileData.lastFMUsername,
        appleMusic: profileData.appleMusicIsConnected,
      },
    });
  };

  useEffect(() => {
    fetchProfile()
      .then((profileData) => {
        setAuthStateFromProfile(profileData);
      })
      .catch((error) => {
        console.error("Failed to fetch profile:", error);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        updateAuthState,
        resetAuthState,
        setAuthStateFromProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
