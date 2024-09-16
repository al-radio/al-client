import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Avatar,
} from "react95";
import ProfileAnchor from "./ProfileAnchor";
import GetSong from "../modals/GetSong";
import PausingMarquee from "./PausingMarqee";

const SongHistoryTable = ({ songHistory, fields }) => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSong(null);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell></TableHeadCell>
            {fields.title && <TableHeadCell>Title</TableHeadCell>}
            {fields.artist && <TableHeadCell>Artist</TableHeadCell>}
            {fields.album && <TableHeadCell>Album</TableHeadCell>}
            {fields.userSubmittedId && <TableHeadCell>Requested</TableHeadCell>}
            {fields.datePlayed && <TableHeadCell>Time Played</TableHeadCell>}
            {fields.likes && <TableHeadCell>Likes</TableHeadCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {songHistory.map((song, index) => (
            <TableRow key={index} onClick={() => handleRowClick(song)}>
              <TableDataCell>
                <Avatar
                  square
                  size={50}
                  src={song.artUrl}
                  style={{ marginTop: 10 }}
                />
              </TableDataCell>
              {fields.title && (
                <TableDataCell>
                  <PausingMarquee text={song.title} />
                </TableDataCell>
              )}
              {fields.artist && (
                <TableDataCell>
                  <PausingMarquee text={song.artist} />
                </TableDataCell>
              )}
              {fields.album && (
                <TableDataCell>
                  <PausingMarquee text={song.album} />
                </TableDataCell>
              )}
              {fields.userSubmittedId && (
                <TableDataCell
                  onClick={(e) => e.stopPropagation()} // Prevents row click when clicking on ProfileAnchor
                >
                  {song.userSubmittedId ? (
                    <ProfileAnchor handle={song.userSubmittedId} />
                  ) : (
                    "AL"
                  )}
                </TableDataCell>
              )}
              {fields.datePlayed && (
                <TableDataCell>
                  <PausingMarquee
                    text={
                      new Date(song.datePlayed).toDateString() +
                      ", " +
                      new Date(song.datePlayed).toLocaleTimeString() +
                      " EST"
                    }
                    sizeLimit={15}
                  />
                </TableDataCell>
              )}
              {fields.likes && <TableDataCell>{song.likes}</TableDataCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSong && (
        <GetSong
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          urlForPlatform={selectedSong.urlForPlatform}
          trackId={selectedSong.trackId}
        />
      )}
    </>
  );
};

export default SongHistoryTable;
