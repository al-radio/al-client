import { useEffect, useState } from "react";
import { Window, WindowHeader, WindowContent, Counter, Button } from "react95";
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
  const [listenerCount, setListenerCount] = useState(0);
  const { toggleVisibility } = useVisibility();

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
        <WindowContent style={{ display: "flex", justifyContent: "center" }}>
          <Counter value={1} minLength={1} />
        </WindowContent>
      </Window>
    </ResponsiveLayout>
  );
};

export default Customize;
