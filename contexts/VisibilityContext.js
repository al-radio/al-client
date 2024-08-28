import React, { createContext, useContext, useState } from "react";

const VisibilityContext = createContext();

export const VisibilityProvider = ({ children }) => {
  const [visibility, setVisibility] = useState({
    audioPlayer: true,
    songHistory: true,
    nextSong: true,
    submitSong: true,
    listeners: true,
    account: true,
  });

  const toggleVisibility = (component) => {
    setVisibility((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  return (
    <VisibilityContext.Provider value={{ visibility, toggleVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => useContext(VisibilityContext);
