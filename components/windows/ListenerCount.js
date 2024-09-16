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
    const listenersEventSource = fetchListenerCount();
    console.log(listenersEventSource);
    listenersEventSource.onmessage = (event) => {
      const listeners = JSON.parse(event.data);
      console.log("listeners:", listeners);
      setListenerCount(listeners.count.total);
      setListenerList(listeners.list);
    };

    return () => {
      listenersEventSource.close();
    };
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
