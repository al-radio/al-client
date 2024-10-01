import { useEffect, useState, useRef } from "react";
import { WindowContent, Avatar, Anchor } from "react95";
import styled from "styled-components";
import { fetchNextSong } from "../../services/api";
import ResponsiveWindowBase from "../foundational/ResponsiveWindowBase";
import ProfileAnchor from "../foundational/ProfileAnchor";
import PausingMarquee from "../foundational/PausingMarqee";
import { useLiveData } from "@/contexts/LiveDataContext";

const StyledWindowContent = styled(WindowContent)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledAvatar = styled(Avatar)`
  width: 100%;
  max-width: 100px; /* Adjust size as needed */
  height: auto;
  margin-right: 16px;
`;

const SongDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
`;

const windowId = "nextSong";

const NextSong = () => {
  const { liveData } = useLiveData();
  const { nextSong } = liveData;

  return (
    <ResponsiveWindowBase windowId={windowId} windowHeaderTitle="Up Next">
      <StyledWindowContent>
        {nextSong?.title ? (
          <>
            <StyledAvatar square src={nextSong.artUrl} />
            <SongDetails>
              <PausingMarquee text={nextSong.title} sizeLimit={30} />
              <PausingMarquee text={nextSong.artist} sizeLimit={30} />
              <PausingMarquee text={nextSong.album} sizeLimit={30} />
              <p>
                Requested by:{" "}
                {nextSong.userSubmittedId ? (
                  <ProfileAnchor handle={nextSong.userSubmittedId} />
                ) : (
                  "AL"
                )}
              </p>
            </SongDetails>
          </>
        ) : (
          <>
            <StyledAvatar square />
            <SongDetails>
              <h2>Nothing Queued</h2>
              <p>Nothing Queued</p>
              <p>Nothing Queued</p>
            </SongDetails>
          </>
        )}
      </StyledWindowContent>
    </ResponsiveWindowBase>
  );
};

export default NextSong;
