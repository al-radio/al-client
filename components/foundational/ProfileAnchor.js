import React from "react";
import { Anchor } from "react95";
import { useProfiles } from "@/contexts/ProfilesContext";

const ProfileAnchor = ({ handle }) => {
  const { addProfile } = useProfiles();

  const handleClick = async () => {
    await addProfile(handle);
  };

  return (
    <>
      <Anchor onClick={handleClick}>{handle}</Anchor>
    </>
  );
};

export default ProfileAnchor;
