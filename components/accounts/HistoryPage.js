import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Avatar,
  ScrollView,
} from "react95";
import { fetchSongHistory } from "@/services/api";
import GetSong from "../modals/GetSong";

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
  const [selectedSong, setSelectedSong] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSongHistory(handle).then((historyData) => {
      setSongHistory(historyData);
    });
  }, [handle]);

  const handleRowClick = (song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSong(null);
  };

  return (
    <ScrollView
      scrollable
      style={{ height: "400px", maxWidth: "550px", overflow: "auto" }}
    >
      <Table>
        <TableHead>
          <TableHeadCell></TableHeadCell>
          <TableHeadCell>Title</TableHeadCell>
          <TableHeadCell>Artist</TableHeadCell>
          <TableHeadCell>Album</TableHeadCell>
          <TableHeadCell>Time</TableHeadCell>
        </TableHead>
        <TableBody>
          {songHistory.map((song, index) => (
            <TableRow key={index}>
              <TableDataCell onClick={() => handleRowClick(song)}>
                <Avatar
                  square
                  size={50}
                  src={song.artUrl}
                  style={{ marginTop: 10 }}
                />
              </TableDataCell>
              <TableDataCell onClick={() => handleRowClick(song)}>
                {song.title}
              </TableDataCell>
              <TableDataCell onClick={() => handleRowClick(song)}>
                {song.artist}
              </TableDataCell>
              <TableDataCell onClick={() => handleRowClick(song)}>
                {song.album}
              </TableDataCell>
              <TableDataCell onClick={() => handleRowClick(song)}>
                {new Date(song.datePlayed).toLocaleString()} EST
              </TableDataCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSong && (
        <GetSong
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          urlForPlatform={selectedSong.urlForPlatform}
        />
      )}
    </ScrollView>
  );
};

export default HistoryPage;
