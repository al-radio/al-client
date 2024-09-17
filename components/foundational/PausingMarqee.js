import React, { useState } from "react";
import Marquee from "react-fast-marquee";

const PausingMarquee = ({ text, sizeLimit = 20 }) => {
  const [isMoving, setIsMoving] = useState(true);

  if (!text) return null;
  if (text.length <= sizeLimit)
    return (
      <>
        {text}
        <br />
      </>
    );
  const paddedText = `${text}${"\u00A0".repeat(sizeLimit)}`;

  // Stop on cycle finish, then resume
  const handleCycleComplete = () => {
    setIsMoving(false);
    setTimeout(() => {
      setIsMoving(true);
    }, 2000);
  };

  return (
    <Marquee
      play={isMoving}
      onCycleComplete={handleCycleComplete}
      speed={50}
      gradient={false}
      style={{ width: `${Math.min(text.length, sizeLimit) + 1}ch` }}
    >
      {paddedText}
    </Marquee>
  );
};

export default PausingMarquee;
