import React, { useEffect, useState } from "react";
import { WindowContent, ScrollView, Button as React95Button } from "react95";
import styled from "styled-components";
import { fetchGlobalSongHistory } from "../../services/api";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import SongHistoryTable from "../foundational/SongHistoryTable";

// Styled Components
const ButtonContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  margin-top: 10px;
`;

const Button = styled(React95Button)`
  width: 150px;
  margin: 0 10px;
`;

const windowId = "songHistory";

const SongHistory = () => {
  const [songHistory, setSongHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    const songHistoryEventSource = fetchGlobalSongHistory(currentPage);

    songHistoryEventSource.onmessage = (event) => {
      const { tracks, isLastPage } = JSON.parse(event.data);
      setSongHistory(tracks);
      setIsLastPage(isLastPage);
    };

    return () => {
      songHistoryEventSource.close();
    };
  }, [currentPage]);

  const handleNextPage = () => {
    if (!isLastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  };

  return (
    <ResponsiveWindowBase
      windowId={windowId}
      windowHeaderTitle="History"
      defaultPosition={{ x: 1500, y: 550 }}
    >
      <WindowContent>
        <ScrollView scrollable style={{ height: "400px", maxWidth: "95vw" }}>
          <SongHistoryTable
            songHistory={songHistory}
            fields={{
              title: true,
              artist: true,
              album: true,
              userSubmittedId: true,
              likes: true,
            }}
          />
        </ScrollView>
        <ButtonContainer>
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous Page
          </Button>
          <Button onClick={handleNextPage} disabled={isLastPage}>
            Next Page
          </Button>
        </ButtonContainer>
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default SongHistory;
