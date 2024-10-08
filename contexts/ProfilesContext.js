// ProfileContext.js
import React, { createContext, useState, useContext } from "react";
import { fetchPublicProfile } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomization } from "./CustomizationContext";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const { authState } = useAuth();
  const { setVisibility, bringToFront } = useCustomization();

  const addProfile = async (handle) => {
    try {
      const profile = await fetchPublicProfile(handle);

      setProfiles((prevProfiles) => {
        const isSelf = handle === authState.handle;
        if (isSelf) {
          return prevProfiles;
        }

        const exists = prevProfiles.some((p) => p.handle === profile.handle);
        if (!exists) {
          return [
            ...prevProfiles,
            { handle: profile.handle, avatarUrl: profile.avatarUrl },
          ];
        }

        return prevProfiles
          .filter((p) => p.handle !== profile.handle)
          .concat({ handle: profile.handle, avatarUrl: profile.avatarUrl });
      });

      bringToFront("social");
      setVisibility("social", true);
    } catch (error) {
      console.error(error);
    }
  };

  const removeProfile = (handle) => {
    setProfiles((prevProfiles) =>
      prevProfiles.filter((p) => p.handle !== handle),
    );
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        addProfile,
        removeProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfiles = () => useContext(ProfileContext);
