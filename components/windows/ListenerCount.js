import { useEffect, useState } from "react";
import { fetchListenerCount } from "../../services/api";
import { WindowContent, Counter } from "react95";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import Marquee from "react-fast-marquee";

const windowId = "listeners";

const ListenerCount = () => {
  const [listenerCount, setListenerCount] = useState(0);
  const [listenerList, setListenerList] = useState([]);

  useEffect(() => {
    const getListenerCount = async () => {
      try {
        const listeners = await fetchListenerCount();
        setListenerCount(listeners.count.total);
        setListenerList(listeners.list);
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
      <WindowContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Counter value={listenerCount} minLength={12} />
        </div>
        <div style={{ width: "100%", marginTop: "10px" }}>
          <Marquee gradient={false} speed={80}>
            {listenerList.map((listener, index) => (
              <span key={index} style={{ padding: "0 10px" }}>
                {listener}
              </span>
            ))}
          </Marquee>
        </div>
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default ListenerCount;
