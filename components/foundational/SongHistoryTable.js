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
import styled from "styled-components";
import ProfileAnchor from "./ProfileAnchor";
import GetSong from "../modals/GetSong";
import PausingMarquee from "./PausingMarqee";

const StyledTableDataCell = styled(TableDataCell)`
  border-bottom: 1px dashed ${({ theme }) => theme.canvasTextDisabled};
  padding-left: 5px;
  vertical-align: middle;
`;

const StyledTableHeadCell = styled(TableHeadCell)`
  // fit text to cell width
  white-space: nowrap;
`;

const StyledTableRow = styled(TableRow)`
  cursor: pointer;
`;

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

  const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000); // Years

    if (interval >= 1) {
      return `${interval}y ago`;
    }
    interval = Math.floor(seconds / 2592000); // Months
    if (interval >= 1) {
      return `${interval}M ago`;
    }
    interval = Math.floor(seconds / 86400); // Days
    if (interval >= 1) {
      return `${interval}d ago`;
    }
    interval = Math.floor(seconds / 3600); // Hours
    if (interval >= 1) {
      return `${interval}h ago`;
    }
    interval = Math.floor(seconds / 60); // Minutes
    if (interval >= 1) {
      return `${interval}m ago`;
    }
    return `${seconds}s ago`; // Seconds
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell></TableHeadCell>
            {fields.title && (
              <StyledTableHeadCell>Title/Artist/Album</StyledTableHeadCell>
            )}
            {fields.userSubmittedId && (
              <StyledTableHeadCell>Requested</StyledTableHeadCell>
            )}
            {fields.datePlayed && (
              <StyledTableHeadCell>Time Played</StyledTableHeadCell>
            )}
            {fields.likes && <StyledTableHeadCell>Likes</StyledTableHeadCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {songHistory.map((song, index) => (
            <StyledTableRow key={index} onClick={() => handleRowClick(song)}>
              <StyledTableDataCell>
                <Avatar
                  square
                  size={60}
                  src={song.artUrl}
                  style={{ marginTop: 10 }}
                />
              </StyledTableDataCell>
              {fields.title && (
                <StyledTableDataCell style={{ lineHeight: "1.4" }}>
                  <PausingMarquee text={song.title} />
                  <PausingMarquee text={song.artist} />
                  <PausingMarquee text={song.album} />
                </StyledTableDataCell>
              )}
              {fields.userSubmittedId && (
                <StyledTableDataCell onClick={(e) => e.stopPropagation()}>
                  {song.userSubmittedId ? (
                    <ProfileAnchor handle={song.userSubmittedId} />
                  ) : (
                    "AL"
                  )}
                </StyledTableDataCell>
              )}
              {fields.datePlayed && (
                <StyledTableDataCell>
                  {timeAgo(song.datePlayed)}
                </StyledTableDataCell>
              )}
              {fields.likes && (
                <StyledTableDataCell>{song.likes}</StyledTableDataCell>
              )}
            </StyledTableRow>
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
