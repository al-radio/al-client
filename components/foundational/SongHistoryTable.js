import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Avatar,
  ScrollView,
  Anchor,
} from "react95";
import styled from "styled-components";
import ProfileAnchor from "./ProfileAnchor";
import GetSong from "../modals/GetSong";
import PausingMarquee from "./PausingMarqee";
import { fetchGlobalSongHistory, fetchUserSongHistory } from "@/services/api";
import { useLiveData } from "@/contexts/LiveDataContext";

// Styled Components for pagination
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const PageAnchor = styled(Anchor)`
  margin: 0;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.progress};
  ${({ isActive, theme }) =>
    isActive &&
    `
    font-weight: bold;
    text-decoration: underline;
    color: ${theme.hover}; /* Active page color */
  `}
`;

const StyledTableDataCell = styled(TableDataCell)`
  border-bottom: 1px dashed ${({ theme }) => theme.canvasTextDisabled};
  padding-left: 5px;
  vertical-align: middle;
`;

const StyledTableHeadCell = styled(TableHeadCell)`
  white-space: nowrap;
`;

const StyledTableRow = styled(TableRow)`
  cursor: pointer;
`;

const SongHistoryTable = ({
  fields,
  numVisibleEntries,
  handle = "",
  itemsPerPage = 10,
}) => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [songHistory, setSongHistory] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const { liveData } = useLiveData();

  useEffect(() => {
    const fetchSongHistory = async () => {
      try {
        const history = handle
          ? await fetchUserSongHistory(handle, currentPage)
          : await fetchGlobalSongHistory(currentPage);
        setSongHistory(history.tracks);
        setNumberOfPages(history.numberOfPages);
      } catch (error) {
        console.error("Error fetching song history:", error);
      }
    };

    fetchSongHistory(currentPage);
  }, [handle, currentPage, liveData.currentSong]);

  const handleRowClick = (song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSong(null);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const totalPages = 10;

    // if there are less than totalPages pages, show all pages
    if (numberOfPages <= totalPages) {
      for (let i = 1; i <= numberOfPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    // if the current page is less than totalPages / 2, show the first totalPages pages
    if (currentPage <= totalPages / 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    // if the current page is greater than numberOfPages - totalPages / 2, show the last totalPages pages
    if (currentPage > numberOfPages - totalPages / 2) {
      for (let i = numberOfPages - totalPages + 1; i <= numberOfPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    // show totalPages pages centered around the current page
    for (
      let i = currentPage - Math.floor(totalPages / 2);
      i < currentPage + Math.floor(totalPages / 2);
      i++
    ) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000); // Years
    if (interval >= 1) {
      return `${interval}y ago`;
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
      <ScrollView
        scrollable
        style={{ height: numVisibleEntries * 100, maxWidth: "74vw" }}
      >
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
            {songHistory &&
              songHistory.map((song, index) => (
                <StyledTableRow
                  key={index}
                  onClick={() => handleRowClick(song)}
                >
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
      </ScrollView>

      {/* Pagination controls */}
      <PaginationContainer>
        <PageAnchor
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </PageAnchor>
        <PageAnchor
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          {"<"}
        </PageAnchor>

        {generatePageNumbers().map((page, index) => (
          <PageAnchor
            key={index}
            onClick={() => handlePageClick(page)}
            isActive={page === currentPage}
          >
            {page}
          </PageAnchor>
        ))}

        <PageAnchor
          onClick={() =>
            setCurrentPage(Math.min(numberOfPages, currentPage + 1))
          }
          disabled={currentPage === numberOfPages}
        >
          {">"}
        </PageAnchor>
        <PageAnchor
          onClick={() => setCurrentPage(numberOfPages)}
          disabled={currentPage === numberOfPages}
        >
          {">>"}
        </PageAnchor>
      </PaginationContainer>

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
