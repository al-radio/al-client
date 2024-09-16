import React, { useEffect, useState } from "react";
import { WindowContent, ScrollView } from "react95";
import {
  fetchGlobalSongHistory,
  fetchUserSongHistory,
} from "../../services/api";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import SongHistoryTable from "../foundational/SongHistoryTable";

const windowId = "songHistory";

const SongHistory = () => {
  const [songHistory, setSongHistory] = useState([
    {
      title: "Loading...",
      artist: "Loading...",
      artUrl: "",
      urlForPlatform: {
        spotify: "default",
        appleMusic: "default",
      },
    },
  ]);

  useEffect(() => {
    const songHistoryEventSource = fetchGlobalSongHistory();
    console.log;
    songHistoryEventSource.onmessage = (event) => {
      const historyData = JSON.parse(event.data);
      setSongHistory(historyData);
    };

    return () => {
      songHistoryEventSource.close();
    };
  }, []);

  return (
    <ResponsiveWindowBase
      windowId={windowId}
      windowHeaderTitle="History"
      defaultPosition={{ x: 1500, y: 550 }}
    >
      <WindowContent>
        <ScrollView scrollable style={{ height: "400px", maxWidth: "95vw" }}>
          <SongHistoryTable
            songHistory={songHistory}
            fields={{
              title: true,
              artist: true,
              album: true,
              userSubmittedId: true,
              likes: true,
            }}
          />
        </ScrollView>
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default SongHistory;
