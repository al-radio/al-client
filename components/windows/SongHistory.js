import React, { useEffect, useState } from "react";
import { WindowContent, ScrollView } from "react95";
import { fetchSongHistory } from "../../services/api";
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
    const getSongHistory = async () => {
      try {
        const historyData = await fetchSongHistory();
        setSongHistory(historyData);
      } catch (error) {
        console.error("Error fetching song history:", error);
      }
    };

    getSongHistory();
    const intervalId = setInterval(getSongHistory, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ResponsiveWindowBase
      windowId={windowId}
      windowHeaderTitle="History"
      defaultPosition={{ x: 1500, y: 550 }}
    >
      <WindowContent>
        <ScrollView scrollable style={{ height: "400px" }}>
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
