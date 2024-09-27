import React from "react";
import { Window, WindowContent, WindowHeader } from "react95";

const LoadingScreen = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Window
        style={{
          width: "300px",
          height: "auto",
          zIndex: 1001,
          position: "relative",
        }}
      >
        <WindowHeader>Loading</WindowHeader>
        <WindowContent>
          <p>
            The little critters in your computer are working as fast as they can
            (without pay)
          </p>
        </WindowContent>
      </Window>
    </div>
  );
};

export default LoadingScreen;
