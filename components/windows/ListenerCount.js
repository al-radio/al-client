import { useEffect, useState } from "react";
import { fetchListenerCount } from "../../services/api";
import { WindowContent, Counter } from "react95";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";

const windowId = "listeners";

const ListenerCount = () => {
  const [listenerCount, setListenerCount] = useState(0);

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
    <ResponsiveWindowBase
      windowId={windowId}
      windowHeaderTitle="Listeners"
      defaultPosition={{ x: 200, y: 600 }}
    >
      <WindowContent style={{ display: "flex", justifyContent: "center" }}>
        <Counter value={listenerCount} minLength={12} />
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default ListenerCount;
