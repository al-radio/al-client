import React, { useEffect, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import { Button, Window, WindowHeader } from "react95";
import { useIsMobile } from "@/contexts/isMobileContext";
import { useCustomization } from "@/contexts/CustomizationContext";

// Style for mobile layout
const MobileWindow = styled.div`
  width: 100%;
  > div {
    width: 100%;
  }
`;

const ResponsiveWindowBase = ({
  children,
  windowId,
  defaultPosition,
  windowHeaderTitle,
}) => {
  const isMobile = useIsMobile();
  const childRef = useRef(null);
  const { customization, bringToFront, toggleVisibility, updatePosition } =
    useCustomization();

  const { isVisible, position, zIndex } = customization[windowId] || {};

  const handleCloseButton = () => {
    toggleVisibility(windowId);
  };

  // Set default position if no position is stored in the context
  useEffect(() => {
    if (!position) {
      updatePosition(windowId, defaultPosition);
    }
  }, [defaultPosition, position, updatePosition, windowId]);

  // Handle bringing the window to the front
  const handleInteraction = () => {
    bringToFront(windowId);
  };

  // Handle window resizing (keep the window in view)
  const handleResize = useCallback(() => {
    if (!childRef.current || !position) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const { x, y } = position;
    const width = childRef.current.offsetWidth;
    const height = childRef.current.offsetHeight;

    let newX = x;
    let newY = y;

    // Adjust x and y position if out of bounds
    if (x + width > windowWidth) newX = windowWidth - width;
    if (newX < 0) newX = 0;
    if (y + height > windowHeight) newY = windowHeight - height;
    if (newY < 0) newY = 0;

    // Update the position only if it has changed
    if (newX !== x || newY !== y) {
      updatePosition(windowId, { x: newX, y: newY });
    }
  }, [position, updatePosition, windowId]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Ensure window is resized on load
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // Common Content Component
  const Content = (
    <>
      {isVisible && (
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
    </>
  );

  // Handle mobile layout
  if (isMobile) {
    return <MobileWindow>{Content}</MobileWindow>;
  }

  // Handle desktop layout with resizable and draggable windows
  return (
    <Rnd
      bounds="parent"
      enableResizing={false}
      dragHandleClassName="window-header"
      style={{ zIndex }}
      position={position || defaultPosition} // Use context position or default
      onDragStop={(e, data) => {
        updatePosition(windowId, { x: data.x, y: data.y });
      }}
      onDragStart={handleInteraction}
      onResizeStart={handleInteraction}
      onMouseDown={handleInteraction}
    >
      <div style={{ width: "100%", height: "100%" }} ref={childRef}>
        {Content}
      </div>
    </Rnd>
  );
};

export default ResponsiveWindowBase;
