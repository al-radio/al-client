import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchProfile } from "@/services/api";

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
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile(token)
        .then((profileData) => {
          updateAuthState({
            handle: profileData.handle,
            avatarUrl: profileData.avatarUrl,
          });
        })
        .catch((error) => {
          console.error("Failed to fetch profile:", error);
        });
    }
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
