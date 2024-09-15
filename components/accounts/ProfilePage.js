import React from "react";
import { Anchor, Avatar, Button } from "react95";
import styled from "styled-components";
import { authorizeSpotify, authorizeLastFM } from "../../services/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Online = styled.div`
  color: ${({ theme }) => theme.hoverBackground};
`;

const Offline = styled.div`
  color: ${({ theme }) => theme.canvasTextDisabled};
`;

const ProfilePage = ({ profile }) => {
  if (!profile) return null;

  const openSpotifyProfile = () => {
    const spotifyProfileUrl = `https://open.spotify.com/user/${profile.spotifyUserId}`;
    window.open(spotifyProfileUrl, "_blank", "noopener,noreferrer");
  };

  const openLastFMProfile = () => {
    const lastFMProfileUrl = `https://www.last.fm/user/${profile.lastFMUsername}`;
    window.open(lastFMProfileUrl, "_blank", "noopener,noreferrer");
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
          <Button onClick={openSpotifyProfile}>
            Spotify: {profile.spotifyUserId}
          </Button>
        )}

        {profile.lastFMUsername && (
          <Button onClick={openLastFMProfile}>
            LastFM: {profile.lastFMUsername}
          </Button>
        )}
      </div>
    );
  }

  return content;
};

export default ProfilePage;
