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

  useEffect(() => {
    fetchProfile()
      .then((profileData) => {
        updateAuthState({
          handle: profileData.handle,
          avatarUrl: profileData.avatarUrl || `${API_URL}/avatars/default.png`,
          linkedServices: {
            spotify: profileData.spotifyUserId,
          },
        });
      })
      .catch((error) => {
        console.error("Failed to fetch profile:", error);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ authState, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
