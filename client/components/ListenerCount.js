// components/ListenerCount.js
import { useEffect, useState } from 'react';
import { fetchListenerCount } from '../services/api';
import { Window, WindowHeader, WindowContent } from 'react95';
import styled from 'styled-components';

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
        console.error('Error fetching listener count:', error);
      }
    };

    getListenerCount();
    const intervalId = setInterval(getListenerCount, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Window style={{ width: 300, height: 150 }}>
      <WindowHeader>Listener Count</WindowHeader>
      <WindowContent>
        <ListenerCountWrapper>
          <h2>Active Listeners:</h2>
          <p>{listenerCount}</p>
        </ListenerCountWrapper>
      </WindowContent>
    </Window>
  );
};

export default ListenerCount;
