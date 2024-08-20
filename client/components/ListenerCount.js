// components/ListenerCount.js
import { useEffect, useState } from "react";
import { fetchListenerCount } from "../services/api";
import { Window, WindowHeader, WindowContent, Counter } from "react95";
import styled from "styled-components";

const ListenerCountWrapper = styled.div`
  padding: 10px;
`;

const ListenerCount = () => {
  const [listenerCount, setListenerCount] = useState(0);

  useEffect(() => {
    const getListenerCount = async () => {
      try {
        const count = await fetchListenerCount();
        setListenerCount(count);
      } catch (error) {
        console.error("Error fetching listener count:", error);
      }
    };

    getListenerCount();
    setInterval(getListenerCount, 10000);
  }, []);

  return (
    <Window>
      <WindowHeader>Listeners</WindowHeader>
      <WindowContent>
        <Counter value={listenerCount} />
      </WindowContent>
    </Window>
  );
};

export default ListenerCount;
