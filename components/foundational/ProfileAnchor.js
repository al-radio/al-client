import React, { useState } from "react";
import { Anchor } from "react95";
import ProfileModal from "../modals/ProfileModal";

const ProfileAnchor = ({ handle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Anchor onClick={handleClick}>{handle}</Anchor>
      <ProfileModal isOpen={isModalOpen} onClose={closeModal} handle={handle} />
    </>
  );
};

export default ProfileAnchor;
