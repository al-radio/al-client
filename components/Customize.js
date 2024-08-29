import React, { useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Radio,
  GroupBox,
} from "react95";
import ResponsiveLayout from "./ResponsiveLayout";
import { useVisibility } from "@/contexts/VisibilityContext";
import { useTheme } from "@/contexts/ThemeContext";

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

const Customize = () => {
  const { toggleVisibility } = useVisibility();
  const { toggleTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState("Original");

  const handleCloseButton = () => {
    toggleVisibility("customize");
  };

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

  const handleSetTheme = () => {
    toggleTheme(themeMap[selectedTheme]);
  };

  return (
    <ResponsiveLayout
      uniqueKey="customize"
      defaultPosition={{ x: 200, y: 600 }}
    >
      <Window>
        <WindowHeader
          className="window-header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>Customize</span>
          <Button onClick={handleCloseButton}>
            <span className="close-icon" />
          </Button>
        </WindowHeader>
        <WindowContent>
          <GroupBox label="Choose a Theme">
            {Object.keys(themeMap).map((themeName) => (
              <>
                <Radio
                  key={themeName}
                  checked={selectedTheme === themeName}
                  onChange={() => setSelectedTheme(themeName)}
                  label={themeName}
                  name="themes"
                />
                <br />
              </>
            ))}
          </GroupBox>
          <Button
            onClick={handleSetTheme}
            style={{ marginTop: "20px", width: "100%" }}
          >
            Set Theme
          </Button>
        </WindowContent>
      </Window>
    </ResponsiveLayout>
  );
};

export default Customize;
