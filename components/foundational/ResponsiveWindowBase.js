import React, { useEffect, useState, useCallback, useRef } from "react";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import { useZIndex } from "@/contexts/ZIndexContext";
import { useIsMobile } from "@/contexts/isMobileContext";
import { useVisibility } from "@/contexts/VisibilityContext";
import { Button, Window, WindowHeader } from "react95";

// Style for mobile layout
const MobileWindow = styled.div`
  width: 100%;
  > div {
    width: 100%;
  }
`;

const getLocalStorageKey = (windowId) => `responsiveLayoutPosition_${windowId}`;

const ResponsiveWindowBase = ({
  children,
  windowId,
  defaultPosition,
  windowHeaderTitle,
}) => {
  const [zIndex, setZIndex] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { visibility } = useVisibility();
  const bringToFront = useZIndex();
  const isMobile = useIsMobile();
  const childRef = useRef(null);
  const { toggleVisibility } = useVisibility();

  const handleCloseButton = () => {
    toggleVisibility(windowId);
  };

  // Load saved position and size from local storage
  useEffect(() => {
    const savedPosition = localStorage.getItem(getLocalStorageKey(windowId));
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      setPosition(defaultPosition);
    }
  }, [defaultPosition, windowId]);

  // Save position and size to local storage
  useEffect(() => {
    localStorage.setItem(
      getLocalStorageKey(windowId),
      JSON.stringify(position),
    );
  }, [position, windowId]);

  // Handle bringing the window to the front
  const handleInteraction = () => {
    setZIndex(bringToFront());
  };

  // Handle window resizing
  const handleResize = useCallback(() => {
    if (!childRef.current) {
      return;
    }
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const { x, y } = position;
    const width = childRef.current.offsetWidth;
    const height = childRef.current.offsetHeight;

    let newX = x;
    let newY = y;

    // Adjust x position if out of bounds
    if (x + width > windowWidth) {
      newX = windowWidth - width;
    }
    if (newX < 0) {
      newX = 0;
    }

    // Adjust y position if out of bounds
    if (y + height > windowHeight) {
      newY = windowHeight - height;
    }
    if (newY < 0) {
      newY = 0;
    }

    // Update the position only if it has changed
    if (newX !== x || newY !== y) {
      setPosition((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    }
  }, [position]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  if (isMobile) {
    return <MobileWindow>{visibility[windowId] && children}</MobileWindow>;
  }

  return (
    <Rnd
      bounds="parent"
      enableResizing={false}
      dragHandleClassName="window-header"
      style={{
        zIndex,
      }}
      position={{ x: position.x, y: position.y }}
      onDragStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setPosition({
          x: position.x,
          y: position.y,
        });
      }}
      onDragStart={handleInteraction}
      onResizeStart={handleInteraction}
      onMouseDown={handleInteraction}
    >
      <div style={{ width: "100%", height: "100%" }} ref={childRef}>
        {visibility[windowId] && (
          <Window>
            <WindowHeader
              className="window-header"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>{windowHeaderTitle}</span>
              <Button onClick={handleCloseButton}>
                <span className="close-icon" />
              </Button>
            </WindowHeader>
            {children}
          </Window>
        )}
      </div>
    </Rnd>
  );
};

export default ResponsiveWindowBase;
