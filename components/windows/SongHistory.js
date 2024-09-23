import React from "react";
import { WindowContent, ScrollView, Button as React95Button } from "react95";
import styled from "styled-components";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import SongHistoryTable from "../foundational/SongHistoryTable";
import { useLiveData } from "@/contexts/LiveDataContext";

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
  const { liveData, setHistoryPage } = useLiveData();
  const { songHistory, currentPage, isLastPage } = liveData;

  const handleNextPage = () => {
    if (!isLastPage) {
      const nextPage = currentPage + 1;
      setHistoryPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const nextPage = Math.max(currentPage - 1, 1);
      setHistoryPage(nextPage);
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
