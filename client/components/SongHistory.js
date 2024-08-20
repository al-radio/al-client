import { useEffect, useState } from "react";
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
} from "react95";
import { fetchSongHistory } from "../services/api";
import Image from "next/image";

const SongHistory = () => {
  const [songHistory, setSongHistory] = useState([]);

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
    const historyIntervalId = setInterval(getSongHistory, 10000);
    return () => clearInterval(historyIntervalId);
  }, []);

  return (
    <Window>
      <WindowHeader>History</WindowHeader>
      <WindowContent>
        <Table>
          <TableHead>
            <TableHeadCell></TableHeadCell>
            <TableHeadCell>Artist</TableHeadCell>
            <TableHeadCell>Title</TableHeadCell>
            <TableHeadCell>Album</TableHeadCell>
          </TableHead>
          <TableBody>
            {songHistory.map((song, index) => (
              <TableRow key={index}>
                <TableDataCell>
                  <Avatar square size={50} src={song.artUrl} />
                </TableDataCell>
                <TableDataCell>{song.title}</TableDataCell>
                <TableDataCell>{song.artist}</TableDataCell>
                <TableDataCell>{song.album}</TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </WindowContent>
    </Window>
  );
};

export default SongHistory;
