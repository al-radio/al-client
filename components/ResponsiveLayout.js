import React from "react";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import { useZIndex } from "@/contexts/ZIndexContext";
import { useIsMobile } from "@/contexts/isMobileContext";

const MobileWindow = styled.div`
  width: 100%;
  > div {
    width: 100%;
  }
`;

const ResponsiveLayout = ({ children }) => {
  const [zIndex, setZIndex] = React.useState(1);
  const bringToFront = useZIndex();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileWindow>{children}</MobileWindow>;
  }

  const handleInteraction = () => {
    setZIndex(bringToFront());
  };

  return (
    <Rnd
      bounds="parent"
      enableResizing={false}
      style={{ zIndex }}
      onDragStart={handleInteraction}
      onResizeStart={handleInteraction}
      onMouseDown={handleInteraction}
    >
      {children}
    </Rnd>
  );
};

export default ResponsiveLayout;
