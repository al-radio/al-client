import { WindowContent, Counter } from "react95";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import Marquee from "react-fast-marquee";
import { useLiveData } from "@/contexts/LiveDataContext";

const windowId = "listeners";

const ListenerCount = () => {
  const { liveData } = useLiveData();
  const { listenerCount, listenerList } = liveData;

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
