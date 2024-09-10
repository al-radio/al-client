import { API_URL } from "@/services/api";
import React from "react";
import { Avatar } from "react95";
import styled from "styled-components";

const Online = styled.div`
  color: ${({ theme }) => theme.hoverBackground};
`;

const Offline = styled.div`
  color: ${({ theme }) => theme.canvasTextDisabled};
`;

const ProfilePage = ({ profile }) => {
  if (!profile) return null;

  return (
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
          Tuned out since {new Date(profile.lastOnline).toLocaleString()}{" "}
        </Offline>
      )}

      <p>Joined: {new Date(profile.createdDate).toLocaleDateString()}</p>
      {/* <p>Favourite Song: {profile.favouriteSong || "N/A"}</p> */}

      {/* {profile.location && <p>Location: {profile.location}</p>} */}

      <p>Listens: {profile.numberOfSongsListened}</p>

      {/* {profile.linkedServices && (
        <div>
          <h3>Linked Services:</h3>
          <ul>
            {Object.entries(profile.linkedServices).map(
              ([service, url]) => (
                <li key={service}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {service}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default ProfilePage;
