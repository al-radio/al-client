import { useEffect, useState, useRef, useCallback } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableDataCell,
  Avatar,
  ScrollView,
} from "react95";
import { fetchSongHistory } from "../services/api";
import GetSong from "./GetSong";
import ResponsiveLayout from "./ResponsiveLayout";

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
  const [selectedSong, setSelectedSong] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleRowClick = (song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSong(null);
  };

  return (
    <ResponsiveLayout
      uniqueKey="songHistory"
      defaultPosition={{ x: 1500, y: 550 }}
    >
      <Window>
        <WindowHeader className="window-header">History</WindowHeader>
        <WindowContent>
          <ScrollView scrollable style={{ height: "400px" }}>
            <Table style={{ maxWidth: "500px" }}>
              <TableHead>
                <TableHeadCell></TableHeadCell>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Artist</TableHeadCell>
              </TableHead>
              <TableBody>
                {songHistory.map((song, index) => (
                  <TableRow key={index} onClick={() => handleRowClick(song)}>
                    <TableDataCell>
                      <Avatar square size={50} src={song.artUrl} />
                    </TableDataCell>
                    <TableDataCell>{song.title}</TableDataCell>
                    <TableDataCell>{song.artist}</TableDataCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollView>
        </WindowContent>
      </Window>

      {selectedSong && (
        <GetSong
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          urlForPlatform={selectedSong.urlForPlatform}
        />
      )}
    </ResponsiveLayout>
  );
};

export default SongHistory;
