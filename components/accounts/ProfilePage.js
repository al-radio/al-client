import React from "react";
import { Avatar, Button } from "react95";
import styled from "styled-components";
import { authorizeSpotify } from "../../services/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Online = styled.div`
  color: ${({ theme }) => theme.hoverBackground};
`;

const Offline = styled.div`
  color: ${({ theme }) => theme.canvasTextDisabled};
`;

const ProfilePage = ({ profile }) => {
  if (!profile) return null;

  const handleSpotifyAuth = () => {
    // Trigger the authorization flow
    authorizeSpotify();
  };

  const openSpotifyProfile = () => {
    // Open the user's Spotify profile in a new tab
    const spotifyProfileUrl = `https://open.spotify.com/user/${profile.spotifyUserId}`;
    window.open(spotifyProfileUrl, "_blank", "noopener,noreferrer");
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
            <Button onClick={openSpotifyProfile}>
              Spotify: {profile.spotifyUserId}
            </Button>
          </>
        ) : (
          <Button onClick={handleSpotifyAuth}>Connect Spotify</Button>
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
      </div>
    );
  }

  return content;
};

export default ProfilePage;
