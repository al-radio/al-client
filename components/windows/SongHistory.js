import { useEffect, useState } from "react";
import {
  Window,
  WindowContent,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableDataCell,
  Avatar,
  ScrollView,
  Anchor,
} from "react95";
import { fetchSongHistory } from "../../services/api";
import GetSong from "../modals/GetSong";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";

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

  const handleUserClick = (handle) => {
    // todo
    console.log(handle);
  };

  return (
    <ResponsiveWindowBase
      windowId={windowId}
      windowHeaderTitle="History"
      defaultPosition={{ x: 1500, y: 550 }}
    >
      <WindowContent>
        <ScrollView scrollable style={{ height: "400px" }}>
          <Table style={{ maxWidth: "550px" }}>
            <TableHead>
              <TableHeadCell></TableHeadCell>
              <TableHeadCell>Title</TableHeadCell>
              <TableHeadCell>Artist</TableHeadCell>
              <TableHeadCell>Album</TableHeadCell>
              <TableHeadCell>Requested By</TableHeadCell>
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
                  <TableDataCell>
                    {song.userSubmittedId ? (
                      <Anchor
                        onClick={() => handleUserClick(song.userSubmittedId)}
                      >
                        {song.userSubmittedId}
                      </Anchor>
                    ) : (
                      "AL"
                    )}
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollView>
      </WindowContent>

      {selectedSong && (
        <GetSong
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          urlForPlatform={selectedSong.urlForPlatform}
        />
      )}
    </ResponsiveWindowBase>
  );
};

export default SongHistory;
