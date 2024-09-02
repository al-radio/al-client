import { Anchor } from "react95";

const ProfileAnchor = ({ handle }) => {
  const handleClick = () => {
    console.log("Clicked on profile:", handle);
  };

  return <Anchor onClick={() => handleClick(handle)}>{handle}</Anchor>;
};

export default ProfileAnchor;
