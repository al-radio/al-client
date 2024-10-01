import React from "react";
import { WindowContent } from "react95";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import SongHistoryTable from "../foundational/SongHistoryTable";
import { useLiveData } from "@/contexts/LiveDataContext";

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
    <ResponsiveWindowBase windowId={windowId} windowHeaderTitle="History">
      <WindowContent>
        <SongHistoryTable
          songHistory={songHistory}
          numVisibleEntries={4}
          fields={{
            title: true,
            artist: true,
            album: true,
            userSubmittedId: true,
            likes: true,
          }}
        />
      </WindowContent>
    </ResponsiveWindowBase>
  );
};

export default SongHistory;
