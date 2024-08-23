import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import { useZIndex } from "@/contexts/ZIndexContext";
import { useIsMobile } from "@/contexts/isMobileContext";

// Style for mobile layout
const MobileWindow = styled.div`
  width: 100%;
  > div {
    width: 100%;
  }
`;

// layout position per window component
const getLocalStorageKey = (uniqueKey) =>
  `responsiveLayoutPosition_${uniqueKey}`;

const ResponsiveLayout = ({ children, uniqueKey, defaultPosition }) => {
  const [zIndex, setZIndex] = useState(1);
  const [position, setPosition] = useState(defaultPosition);
  const bringToFront = useZIndex();
  const isMobile = useIsMobile();

  // Load saved position from local storage
  useEffect(() => {
    const savedPosition = localStorage.getItem(getLocalStorageKey(uniqueKey));
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, [uniqueKey]);

  // Save position to local storage
  useEffect(() => {
    localStorage.setItem(
      getLocalStorageKey(uniqueKey),
      JSON.stringify(position),
    );
  }, [position, uniqueKey]);

  const handleInteraction = () => {
    setZIndex(bringToFront());
  };

  if (isMobile) {
    return <MobileWindow>{children}</MobileWindow>;
  }

  return (
    <Rnd
      bounds="parent"
      enableResizing={false}
      dragHandleClassName="window-header"
      style={{ zIndex }}
      position={{ x: position.x, y: position.y }}
      size={{ width: position.width, height: position.height }}
      onDragStop={(e, data) =>
        setPosition((prev) => ({ ...prev, x: data.x, y: data.y }))
      }
      onDragStart={handleInteraction}
      onResizeStart={handleInteraction}
      onMouseDown={handleInteraction}
    >
      {children}
    </Rnd>
  );
};

export default ResponsiveLayout;
