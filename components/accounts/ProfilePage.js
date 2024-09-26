import React from "react";
import { Anchor, Avatar, Button } from "react95";
import styled from "styled-components";
import {
  authorizeSpotify,
  authorizeLastFM,
  authorizeAppleMusic,
} from "../../services/api";
import { useMusicKit } from "@/contexts/MusicKitContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Online = styled.div`
  color: ${({ theme }) => theme.hoverBackground};
`;

const Offline = styled.div`
  color: ${({ theme }) => theme.canvasTextDisabled};
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

  let content;

  if (profile.isPrivate) {
    // Render for private profiles
    content = (
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            size={50}
            src={profile.avatarUrl || `${API_URL}/avatars/default.png`}
          />
          <div style={{ marginLeft: "10px" }}>
            <h2>{profile.handle}</h2>
            <p>{profile.bio}</p>
          </div>
        </div>

        {profile.isOnline ? (
          <Online>Tuned in</Online>
        ) : (
          <Offline>
            Tuned out since {new Date(profile.lastOnline).toLocaleString()}
          </Offline>
        )}

        <p>Joined: {new Date(profile.createdDate).toLocaleDateString()}</p>
        <p>Listens: {profile.numberOfSongsListened}</p>

        {profile.spotifyUserId ? (
          <>
            Spotify:{" "}
            <Anchor onClick={openSpotifyProfile}>
              {profile.spotifyUserId}
            </Anchor>
          </>
        ) : (
          <Button onClick={authorizeSpotify}>Connect Spotify</Button>
        )}
        <br />
        {profile.lastFMUsername ? (
          <>
            LastFM:{" "}
            <Anchor onClick={openLastFMProfile}>
              {profile.lastFMUsername}
            </Anchor>
          </>
        ) : (
          <Button onClick={authorizeLastFM}>Connect LastFM</Button>
        )}
        <br />
        {profile.appleMusicIsConnected ? (
          "Apple Music connected"
        ) : (
          <Button onClick={handleMusicAuthorization}>
            Connect Apple Music
          </Button>
        )}
      </div>
    );
  } else {
    // Render for public profiles
    content = (
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            size={50}
            src={profile.avatarUrl || `${API_URL}/avatars/default.png`}
          />
          <div style={{ marginLeft: "10px" }}>
            <h2>{profile.handle}</h2>
            <p>{profile.bio}</p>
          </div>
        </div>

        {profile.isOnline ? (
          <Online>Tuned in</Online>
        ) : (
          <Offline>
            Tuned out since {new Date(profile.lastOnline).toLocaleString()}
          </Offline>
        )}

        <p>Joined: {new Date(profile.createdDate).toLocaleDateString()}</p>
        <p>Listens: {profile.numberOfSongsListened}</p>

        {profile.spotifyUserId && (
          <>
            Spotify:{" "}
            <Anchor onClick={openSpotifyProfile}>
              {profile.spotifyDisplayName || profile.spotifyUserId}
            </Anchor>
          </>
        )}
        <br />
        {profile.lastFMUsername && (
          <>
            LastFM:{" "}
            <Anchor onClick={openLastFMProfile}>
              {profile.lastFMUsername}
            </Anchor>
          </>
        )}
        <br />
        <Button onClick={handleMusicAuthorization}>Connect Apple Music</Button>
      </div>
    );
  }

  return content;
};

export default ProfilePage;
