import React, { useState, useEffect } from "react";
import { ScrollView } from "react95";
import { fetchUserSongHistory } from "@/services/api";
import SongHistoryTable from "../foundational/SongHistoryTable";

const HistoryPage = ({ handle }) => {
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
    fetchUserSongHistory(handle).then((historyData) => {
      setSongHistory(historyData);
    });
  }, [handle]);

  return (
    <ScrollView scrollable style={{ height: "200px", maxWidth: "74vw" }}>
      <SongHistoryTable
        songHistory={songHistory}
        fields={{
          title: true,
          likes: false,
          datePlayed: true,
        }}
      />
    </ScrollView>
  );
};

export default HistoryPage;
