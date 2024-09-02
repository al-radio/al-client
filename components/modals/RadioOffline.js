import React from "react";
import { Window, WindowContent, WindowHeader } from "react95";

const RadioOffline = () => {
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
        <WindowHeader>Radio Offline</WindowHeader>
        <WindowContent>
          <p>
            AL&rsquo;s assistant spilt coffee on the transmitter. We&rsquo;re
            working on it.
          </p>
        </WindowContent>
      </Window>
    </div>
  );
};

export default RadioOffline;
