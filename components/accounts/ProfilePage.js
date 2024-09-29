import React from "react";
import { Anchor, Avatar, Counter, GroupBox, Tooltip } from "react95";
import styled from "styled-components";
import {
  authorizeSpotify,
  authorizeLastFM,
  authorizeAppleMusic,
  unauthorizeAppleMusic,
  unauthorizeLastFM,
  unauthorizeSpotify,
} from "../../services/api";
import { useMusicKit } from "@/contexts/MusicKitContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Online = styled.div`
  color: ${({ theme }) => theme.hoverBackground};
  display: inline-block;
  margin-left: 5px;
`;

const Offline = styled.div`
  color: ${({ theme }) => theme.canvasTextDisabled};
  display: inline-block;
  margin-left: 5px;
`;

const ServiceLinkContainer = styled.div`
  margin: 5px 0;
`;

const ProfilePage = ({ profile }) => {
  const musicKitInstance = useMusicKit();

  const openSpotifyProfile = () => {
    const spotifyProfileUrl = `https://open.spotify.com/user/${profile.spotifyUserId}`;
    window.open(spotifyProfileUrl, "_blank", "noopener,noreferrer");
  };

  const openLastFMProfile = () => {
    const lastFMProfileUrl = `https://www.last.fm/user/${profile.lastFMUsername}`;
    window.open(lastFMProfileUrl, "_blank", "noopener,noreferrer");
  };

  const handleMusicAuthorization = async () => {
    if (!musicKitInstance) {
      console.error("MusicKit instance is not available.");
      return;
    }

    try {
      const musicUserToken = await musicKitInstance.authorize();
      const response = await authorizeAppleMusic(musicUserToken);

      if (response.ok) {
        console.log("Music User Token sent successfully!");
      } else {
        console.error("Failed to send Music User Token:", response.statusText);
      }
    } catch (error) {
      console.error("Error during MusicKit authorization:", error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          size={50}
          src={profile.avatarUrl || `${API_URL}/avatars/default.png`}
        />
        <div style={{ marginLeft: "10px" }}>
          <h2 style={{ display: "inline" }}>{profile.handle}</h2>
          {profile.isOnline ? (
            <Online>Tuned in</Online>
          ) : (
            <Tooltip
              text={"Since: " + new Date(profile.lastOnline).toLocaleString()}
            >
              <Offline>Tuned Out</Offline>
            </Tooltip>
          )}
        </div>
      </div>

      <GroupBox label="Joined" style={{ marginTop: "20px" }}>
        {new Date(profile.createdDate).toLocaleDateString()}
      </GroupBox>

      <GroupBox label="Listens" style={{ textAlign: "center" }}>
        <Counter
          size="sm"
          value={profile.numberOfSongsListened}
          minLength={15}
        />
      </GroupBox>

      <GroupBox label="Services">
        {profile.isPrivate ? (
          <ServiceLinkContainer>
            <span>Apple Music </span>
            {profile.appleMusicIsConnected ? (
              <>
                <Anchor onClick={() => console.log("Open Apple Music profile")}>
                  Open
                </Anchor>
                {" | "}
                <Anchor
                  onClick={async () => {
                    await unauthorizeAppleMusic();
                    window.location.reload();
                  }}
                >
                  Disconnect
                </Anchor>
              </>
            ) : (
              <Anchor onClick={handleMusicAuthorization}>Connect</Anchor>
            )}
          </ServiceLinkContainer>
        ) : (
          profile.appleMusicIsConnected && (
            <ServiceLinkContainer>
              <span>Apple Music </span>
              <Anchor onClick={() => console.log("Open Apple Music profile")}>
                Open
              </Anchor>
            </ServiceLinkContainer>
          )
        )}

        {profile.isPrivate ? (
          <ServiceLinkContainer>
            <span>Spotify </span>
            {profile.spotifyUserId ? (
              <>
                <Anchor onClick={openSpotifyProfile}>Open</Anchor>
                {" | "}
                <Anchor
                  onClick={async () => {
                    await unauthorizeSpotify();
                    window.location.reload();
                  }}
                >
                  Disconnect
                </Anchor>
              </>
            ) : (
              <Anchor onClick={authorizeSpotify}>Connect</Anchor>
            )}
          </ServiceLinkContainer>
        ) : (
          profile.spotifyUserId && (
            <ServiceLinkContainer>
              <span>Spotify </span>
              <Anchor onClick={openSpotifyProfile}>Open</Anchor>
            </ServiceLinkContainer>
          )
        )}

        {profile.isPrivate ? (
          <ServiceLinkContainer>
            <span>Last.FM </span>
            {profile.lastFMUsername ? (
              <>
                <Anchor onClick={openLastFMProfile}>Open</Anchor>
                {" | "}
                <Anchor
                  onClick={async () => {
                    await unauthorizeLastFM();
                    window.location.reload();
                  }}
                >
                  Disconnect
                </Anchor>
              </>
            ) : (
              <Anchor onClick={authorizeLastFM}>Connect</Anchor>
            )}
          </ServiceLinkContainer>
        ) : (
          profile.lastFMUsername && (
            <ServiceLinkContainer>
              <span>Last.FM </span>
              <Anchor onClick={openLastFMProfile}>Open</Anchor>
            </ServiceLinkContainer>
          )
        )}
      </GroupBox>
    </div>
  );
};

export default ProfilePage;
