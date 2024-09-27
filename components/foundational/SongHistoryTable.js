import React, { useState } from "react";
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
import styled from "styled-components";
import ProfileAnchor from "./ProfileAnchor";
import GetSong from "../modals/GetSong";
import PausingMarquee from "./PausingMarqee";

const StyledTableDataCell = styled(TableDataCell)`
  border-bottom: 1px dashed ${({ theme }) => theme.canvasTextDisabled};
  padding-left: 5px;
  vertical-align: middle;
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

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell></TableHeadCell>
            {fields.title && <TableHeadCell>Title/Artist/Album</TableHeadCell>}
            {fields.userSubmittedId && <TableHeadCell>Requested</TableHeadCell>}
            {fields.datePlayed && <TableHeadCell>Time Played</TableHeadCell>}
            {fields.likes && <TableHeadCell>Likes</TableHeadCell>}
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
                  <PausingMarquee
                    text={new Date(song.datePlayed).toDateString()}
                  />
                  <PausingMarquee
                    text={new Date(song.datePlayed).toLocaleTimeString()}
                    sizeLimit={15}
                  />
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
