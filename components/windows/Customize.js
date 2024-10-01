import React, { useState, useEffect } from "react";
import { WindowContent, Radio, GroupBox, Avatar, ScrollView } from "react95";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import { useCustomization } from "@/contexts/CustomizationContext";

import original from "react95/dist/themes/original";
import spruce from "react95/dist/themes/spruce";
import vaporTeal from "react95/dist/themes/vaporTeal";
import highContrast from "react95/dist/themes/highContrast";
import lilac from "react95/dist/themes/lilac";
import maple from "react95/dist/themes/maple";
import pamelaAnderson from "react95/dist/themes/pamelaAnderson";
import theSixtiesUSA from "react95/dist/themes/theSixtiesUSA";
import violetDark from "react95/dist/themes/violetDark";
import candy from "react95/dist/themes/candy";
import { useTheme } from "@/contexts/ThemeContext";

const themeMap = {
  Original: original,
  Candy: candy,
  Spruce: spruce,
  "Vapor Teal": vaporTeal,
  "High Contrast": highContrast,
  Lilac: lilac,
  Maple: maple,
  "Blind Pink": pamelaAnderson,
  "The Sixties": theSixtiesUSA,
  "Violet Dark": violetDark,
};

const windowId = "customize";

const Customize = () => {
  const { toggleTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState("Vapor Teal");

  const handleThemeChange = (themeName) => {
    setSelectedTheme(themeName);
    const theme = themeMap[themeName];
    toggleTheme(theme);
    localStorage.setItem("selectedTheme", themeName);
  };

  const getColorAvatarSrc = (color) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color || "#fff";
    ctx.fillRect(0, 0, 1, 1);
    return canvas.toDataURL();
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("selectedTheme");
    if (storedTheme && themeMap[storedTheme]) {
      setSelectedTheme(storedTheme);
      toggleTheme(themeMap[storedTheme]);
    }
  }, [toggleTheme]);

  return (
    <ResponsiveWindowBase
      windowId={windowId}
      windowHeaderTitle="Customize"
      defaultPosition={{ x: 200, y: 600 }}
    >
      <WindowContent>
        <GroupBox label="Choose a Theme">
          {Object.keys(themeMap).map((themeName) => {
            const theme = themeMap[themeName];
            return (
              <div
                key={themeName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Radio
                  checked={selectedTheme === themeName}
                  onChange={() => handleThemeChange(themeName)}
                  name="themes"
                />

                <div style={{ display: "flex", marginRight: "10px" }}>
                  <Avatar
                    size={20}
                    src={getColorAvatarSrc(theme.material || "#fff")}
                    alt={`${themeName} material color`}
                    style={{ marginRight: "5px" }}
                  />
                  <Avatar
                    size={20}
                    src={getColorAvatarSrc(theme.hoverBackground || "#fff")}
                    alt={`${themeName} header background color`}
                  />
                </div>
                <span>{themeName}</span>
              </div>
            );
          })}
        </GroupBox>
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default Customize;
