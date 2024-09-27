import { fetchGlobalSongHistory, fetchLiveData } from "@/services/api";
import React, { createContext, useState, useContext, useEffect } from "react";

const LiveDataContext = createContext(null);

export const LiveDataProvider = ({ children }) => {
  const [liveData, setLiveData] = useState({
    currentSong: {},
    nextSong: {},
    listenerCount: 0,
    listenerList: [],
    songHistory: [],
    currentPage: 1,
    isLastPage: false,
    numberOfPages: 1,
  });

  const updateLiveData = (eventCategory, data) => {
    setLiveData((prevState) => ({
      ...prevState,
      [eventCategory]: data,
    }));
  };

  const setHistoryPage = (pageNumber) => {
    setLiveData((prevState) => ({
      ...prevState,
      currentPage: pageNumber,
    }));
  };

  // on history page change or song change, fetch new data
  useEffect(() => {
    const fetchHistoryData = async () => {
      const response = await fetchGlobalSongHistory(liveData.currentPage);
      updateLiveData("songHistory", response.tracks);
      updateLiveData("isLastPage", response.isLastPage);
      updateLiveData("numberOfPages", response.numberOfPages);
    };

    fetchHistoryData();
  }, [liveData.currentPage, liveData.currentSong]);

  useEffect(() => {
    const eventSource = fetchLiveData();

    eventSource.addEventListener("currentSongData", (event) => {
      const data = JSON.parse(event.data);
      updateLiveData("currentSong", data);
    });

    eventSource.addEventListener("nextSongData", (event) => {
      const data = JSON.parse(event.data);
      updateLiveData("nextSong", data);
    });

    eventSource.addEventListener("listenersData", (event) => {
      const data = JSON.parse(event.data);
      updateLiveData("listenerCount", data.count?.total);
      updateLiveData("listenerList", data.list);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <LiveDataContext.Provider
      value={{
        liveData,
        setHistoryPage, // Expose the setHistoryPage function
      }}
    >
      {children}
    </LiveDataContext.Provider>
  );
};

// Custom hook to access live data context
export const useLiveData = () => {
  return useContext(LiveDataContext);
};
