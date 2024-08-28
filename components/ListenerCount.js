import { useEffect, useState } from "react";
import { fetchListenerCount } from "../services/api";
import { Window, WindowHeader, WindowContent, Counter, Button } from "react95";
import ResponsiveLayout from "./ResponsiveLayout";
import { useVisibility } from "@/contexts/VisibilityContext";

const ListenerCount = () => {
  const [listenerCount, setListenerCount] = useState(0);
  const { toggleVisibility } = useVisibility();

  const handleCloseButton = () => {
    toggleVisibility("listeners");
  };

  useEffect(() => {
    const getListenerCount = async () => {
      try {
        const listeners = await fetchListenerCount();
        setListenerCount(listeners.count);
      } catch (error) {
        console.error("Error fetching listener count:", error);
      }
    };

    getListenerCount();
    const intervalId = setInterval(getListenerCount, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ResponsiveLayout
      uniqueKey="listeners"
      defaultPosition={{ x: 200, y: 600 }}
    >
      <Window>
        <WindowHeader
          className="window-header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>Listeners</span>
          <Button onClick={handleCloseButton}>
            <span className="close-icon" />
          </Button>
        </WindowHeader>
        <WindowContent style={{ display: "flex", justifyContent: "center" }}>
          <Counter value={listenerCount} minLength={12} />
        </WindowContent>
      </Window>
    </ResponsiveLayout>
  );
};

export default ListenerCount;
