import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Use your existing auth state
import debounce from "lodash.debounce";

const CustomizationContext = createContext();

const initialPreferences = {
  audioPlayer: { isVisible: true, zIndex: 10, position: { x: 0, y: 0 } },
  songHistory: { isVisible: true, zIndex: 11, position: { x: 0, y: 0 } },
  nextSong: { isVisible: true, zIndex: 12, position: { x: 0, y: 0 } },
  submitSong: { isVisible: true, zIndex: 13, position: { x: 0, y: 0 } },
  listeners: { isVisible: true, zIndex: 14, position: { x: 0, y: 0 } },
  customize: { isVisible: false, zIndex: 15, position: { x: 0, y: 0 } },
  social: { isVisible: false, zIndex: 16, position: { x: 0, y: 0 } },
};

const saveCustomizationState = (customization, authState) => {
  if (authState.handle) {
    // Save server-side preferences if logged in
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("customization_state", JSON.stringify(customization));
  }
};

const loadCustomizationState = (authState) => {
  if (authState.handle) {
    // Load server-side preferences if logged in
  }

  if (typeof window === "undefined") return initialPreferences;
  const savedState = localStorage.getItem("customization_state");

  if (savedState) {
    const parsedState = JSON.parse(savedState);
    return {
      ...initialPreferences,
      ...parsedState,
    };
  }

  return initialPreferences;
};

export const CustomizationProvider = ({ children }) => {
  const { authState } = useAuth();
  const [customization, setCustomization] = useState(() =>
    loadCustomizationState(authState),
  );

  useEffect(() => {
    const saveDebounced = debounce(
      () => saveCustomizationState(customization, authState),
      1000,
    );
    saveDebounced();

    return () => {
      saveDebounced.cancel();
    };
  }, [customization, authState]);

  const bringToFront = (windowId) => {
    setCustomization((prev) => {
      const updatedWindows = { ...prev };
      const currentZIndex = updatedWindows[windowId].zIndex;

      // Find the max zIndex and set the selected window's zIndex to max
      const maxZIndex = Math.max(
        ...Object.values(updatedWindows).map((w) => w.zIndex),
      );
      updatedWindows[windowId].zIndex = maxZIndex;

      // Adjust zIndexes for windows above the current one
      Object.keys(updatedWindows).forEach((id) => {
        if (updatedWindows[id].zIndex > currentZIndex && id !== windowId) {
          updatedWindows[id].zIndex -= 1;
        }
      });

      // Normalize zIndexes to the range of 10 to 10 + n
      const minZIndex = Math.min(
        ...Object.values(updatedWindows).map((w) => w.zIndex),
      );
      Object.keys(updatedWindows).forEach((id) => {
        updatedWindows[id].zIndex =
          10 + (updatedWindows[id].zIndex - minZIndex);
      });

      return updatedWindows;
    });
  };

  const toggleVisibility = (windowId) => {
    const newVisibility = !customization[windowId].isVisible;
    return setVisibility(windowId, newVisibility);
  };

  const setVisibility = (windowId, isVisible) => {
    setCustomization((prev) => {
      const windowState = prev[windowId];
      if (!windowState) return prev;

      if (isVisible) {
        bringToFront(windowId);
      }

      return {
        ...prev,
        [windowId]: {
          ...windowState,
          isVisible,
        },
      };
    });
  };

  const updatePosition = (windowId, position) => {
    setCustomization((prev) => {
      return {
        ...prev,
        [windowId]: {
          ...prev[windowId],
          position,
        },
      };
    });
  };

  return (
    <CustomizationContext.Provider
      value={{
        customization,
        bringToFront,
        toggleVisibility,
        setVisibility,
        updatePosition,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => useContext(CustomizationContext);
