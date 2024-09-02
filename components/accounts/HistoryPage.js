import React, { useState, useEffect } from "react";
import { ScrollView } from "react95";
import { fetchSongHistory } from "@/services/api";
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
    fetchSongHistory(handle).then((historyData) => {
      setSongHistory(historyData);
    });
  }, [handle]);

  return (
    <ScrollView
      scrollable
      style={{ height: "400px", maxWidth: "550px", overflow: "auto" }}
    >
      <SongHistoryTable
        songHistory={songHistory}
        fields={{
          title: true,
          artist: true,
          album: true,
          likes: true,
          datePlayed: true,
        }}
      />
    </ScrollView>
  );
};

export default HistoryPage;
