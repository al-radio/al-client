import React, { createContext, useContext, useState, useEffect } from "react";

const VisibilityContext = createContext();

const getLocalStorageKey = (component) => `visibility_${component}`;

export const VisibilityProvider = ({ children }) => {
  const initialVisibility = {
    audioPlayer: true,
    songHistory: true,
    nextSong: true,
    submitSong: true,
    listeners: true,
    account: false,
    customize: false,
  };

  // Function to load visibility state from localStorage
  const loadVisibilityState = () => {
    if (typeof window === "undefined") return initialVisibility; // Return initial state on the server

    const savedVisibility = {};
    for (const component in initialVisibility) {
      const savedState = localStorage.getItem(getLocalStorageKey(component));
      savedVisibility[component] =
        savedState !== null
          ? JSON.parse(savedState)
          : initialVisibility[component];
    }
    return savedVisibility;
  };

  // Initialize visibility state with values from localStorage or defaults
  const [visibility, setVisibility] = useState(loadVisibilityState);

  // Toggle visibility and save the updated state to localStorage
  const toggleVisibility = (component) => {
    setVisibility((prev) => {
      const newVisibility = !prev[component];
      if (typeof window !== "undefined") {
        localStorage.setItem(
          getLocalStorageKey(component),
          JSON.stringify(newVisibility),
        );
      }
      return {
        ...prev,
        [component]: newVisibility,
      };
    });
  };

  return (
    <VisibilityContext.Provider value={{ visibility, toggleVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => useContext(VisibilityContext);
