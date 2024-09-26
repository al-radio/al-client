// MusicKitContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchAppleMusicDeveloperToken } from "@/services/api";

const MusicKitContext = createContext(null);

export const MusicKitProvider = ({ children }) => {
  const [musicKitInstance, setMusicKitInstance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingScript = document.getElementById("musicKitScript");

    const configureMusicKit = async (token) => {
      const instance = window.MusicKit.configure({
        developerToken: token,
        app: {
          name: "AL Radio",
          build: "1.0.0",
        },
      });
      setMusicKitInstance(instance);
      setLoading(false);
      console.log("MusicKit JS configured successfully");
    };

    const loadMusicKitScript = () => {
      return new Promise((resolve, reject) => {
        if (existingScript) {
          resolve(); // Script already loaded
          return;
        }

        const script = document.createElement("script");
        script.src = "https://js-cdn.music.apple.com/musickit/v1/musickit.js";
        script.id = "musicKitScript";
        script.async = true;

        script.onload = async () => {
          if (window.MusicKit) {
            const response = await fetchAppleMusicDeveloperToken();
            resolve(response.developerToken);
          } else {
            reject(new Error("MusicKit not available"));
          }
        };

        script.onerror = () =>
          reject(new Error("Failed to load MusicKit script"));
        document.body.appendChild(script);
      });
    };

    const initializeMusicKit = async () => {
      try {
        const token = await loadMusicKitScript();
        await configureMusicKit(token);
      } catch (error) {
        console.error("Error loading MusicKit:", error);
        setLoading(false);
      }
    };

    initializeMusicKit();

    // Cleanup function to remove the script if unmounted
    return () => {
      const script = document.getElementById("musicKitScript");
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (loading) {
    return <div>Loading MusicKit...</div>;
  }

  return (
    <MusicKitContext.Provider value={musicKitInstance}>
      {children}
    </MusicKitContext.Provider>
  );
};

export const useMusicKit = () => {
  const context = useContext(MusicKitContext);
  if (!context) {
    throw new Error("useMusicKit must be used within a MusicKitProvider");
  }
  return context;
};
