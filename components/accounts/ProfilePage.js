import React from "react";
import { Avatar } from "react95";

const ProfilePage = ({ profile }) => {
  if (!profile) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar size={50} src={profile.avatarUrl || "default-avatar.png"} />
        <div style={{ marginLeft: "10px" }}>
          <h2>{profile.handle}</h2>
          <p>{profile.bio}</p>
        </div>
      </div>

      <p>Joined: {new Date(profile.createdDate).toLocaleDateString()}</p>
      {/* <p>Favourite Song: {profile.favouriteSong || "N/A"}</p> */}

      {/* {profile.isOnline ? (
        <p style={{ color: "green" }}>Online</p>
      ) : (
        <p style={{ color: "red" }}>
          Last Online: {new Date(profile.lastOnline).toLocaleString()}
        </p>
      )} */}

      {/* {profile.location && <p>Location: {profile.location}</p>} */}

      {/* <p>Songs Listened: {profile.numberOfSongsListened}</p> */}

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
