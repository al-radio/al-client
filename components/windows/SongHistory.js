import React from "react";
import { WindowContent, ScrollView, Anchor } from "react95";
import styled from "styled-components";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import SongHistoryTable from "../foundational/SongHistoryTable";
import { useLiveData } from "@/contexts/LiveDataContext";

// Styled Components
// Styled Components
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const PageAnchor = styled(Anchor)`
  margin: 0;
  width: 25px; /* Ensures consistent width for all page numbers */
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

const windowId = "songHistory";

const SongHistory = () => {
  const { liveData, setHistoryPage } = useLiveData();
  const { songHistory, currentPage, isLastPage, numberOfPages } = liveData;

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
      setHistoryPage(page);
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
        <PaginationContainer>
          {/* << First Page */}
          <PageAnchor
            onClick={() => setHistoryPage(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </PageAnchor>

          {/* < Previous Page */}
          <PageAnchor
            onClick={() => setHistoryPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </PageAnchor>

          {/* Dynamic page numbers */}
          {generatePageNumbers().map((page, index) => (
            <PageAnchor
              key={index}
              onClick={() => handlePageClick(page)}
              isActive={page === currentPage}
            >
              {page}
            </PageAnchor>
          ))}

          {/* > Next Page */}
          <PageAnchor
            onClick={() =>
              setHistoryPage(Math.min(numberOfPages, currentPage + 1))
            }
            disabled={currentPage === numberOfPages}
          >
            {">"}
          </PageAnchor>

          {/* >> Last Page */}
          <PageAnchor
            onClick={() => setHistoryPage(numberOfPages)}
            disabled={currentPage === numberOfPages}
          >
            {">>"}
          </PageAnchor>
        </PaginationContainer>
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default SongHistory;
