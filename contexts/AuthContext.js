import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchProfile, API_URL } from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    handle: "",
    avatarUrl: "",
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
