import React, { useState, useCallback, useEffect, useRef } from 'react';

export default function DraggableWindow({ 
  title, 
  children, 
  initialPosition = { x: 0, y: 0 },
  style = {},
  className = '',
  zIndex = 50,
  resizable = true,
  onClose,
  onFocus,
  dragAnywhere = false,
}) {
  const [position, setPosition] = useState(null);
  const [size, setSize] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef(null);
  const aspectRatio = useRef(null);

  const lastTouchRef = useRef(0);

  const handleReset = useCallback(() => {
    setPosition(null);
    setSize(null);
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    
    // Allow interacting with controls inside the title bar without dragging (e.g. close button)
    if (e.target.tagName.toLowerCase() === 'button') return;

    const rect = windowRef.current.getBoundingClientRect();
    const currentX = position?.x ?? rect.left;
    const currentY = position?.y ?? rect.top;
    
    setDragOffset({ x: e.clientX - currentX, y: e.clientY - currentY });
    setIsDragging(true);
  }, [position]);

  const handleTouchStart = useCallback((e) => {
    // Allow interacting with controls
    if (e.target.tagName.toLowerCase() === 'button') return;

    // Double tap detection (300ms threshold)
    const now = Date.now();
    if (now - lastTouchRef.current < 300) {
      handleReset();
      return;
    }
    lastTouchRef.current = now;

    const touch = e.touches[0];
    const rect = windowRef.current.getBoundingClientRect();
    const currentX = position?.x ?? rect.left;
    const currentY = position?.y ?? rect.top;
    
    setDragOffset({ x: touch.clientX - currentX, y: touch.clientY - currentY });
    setIsDragging(true);
  }, [position, handleReset]);

  const handleResizeMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    
    const rect = windowRef.current.getBoundingClientRect();
    aspectRatio.current = rect.width / rect.height;

    // If we haven't dragged yet (position is null), we need to lock in the current position
    // so that resizing doesn't grow "backwards" due to bottom/right initial positioning.
    if (!position) {
      setPosition({ x: rect.left, y: rect.top });
    }
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size?.width ?? rect.width,
      height: size?.height ?? rect.height,
    });
    setIsResizing(true);
  }, [size, position]);

  const handleResizeTouchStart = useCallback((e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    
    const rect = windowRef.current.getBoundingClientRect();
    aspectRatio.current = rect.width / rect.height;

    // Lock position if not already set
    if (!position) {
      setPosition({ x: rect.left, y: rect.top });
    }
    
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: size?.width ?? rect.width,
      height: size?.height ?? rect.height,
    });
    setIsResizing(true);
  }, [size, position]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      const constrainedX = Math.max(-100, Math.min(window.innerWidth - 100, newX));
      const constrainedY = Math.max(0, Math.min(window.innerHeight - 50, newY));
      setPosition({ x: constrainedX, y: constrainedY });
    }
    
    if (isResizing && aspectRatio.current) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const delta = (deltaX + deltaY) / 2;
      
      const newWidth = Math.max(200, resizeStart.width + delta);
      const newHeight = newWidth / aspectRatio.current;
      
      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const handleTouchMove = useCallback((e) => {
    // Prevent scrolling while dragging
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    
    if (isDragging) {
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;
      const constrainedX = Math.max(-100, Math.min(window.innerWidth - 100, newX));
      const constrainedY = Math.max(0, Math.min(window.innerHeight - 50, newY));
      setPosition({ x: constrainedX, y: constrainedY });
    }
    
    if (isResizing && aspectRatio.current) {
      const deltaX = touch.clientX - resizeStart.x;
      const deltaY = touch.clientY - resizeStart.y;
      const delta = (deltaX + deltaY) / 2;
      
      const newWidth = Math.max(200, resizeStart.width + delta);
      const newHeight = newWidth / aspectRatio.current;
      
      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isResizing ? 'nwse-resize' : 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleTouchMove, handleEnd]);

  const getInitialDimensions = () => {
    const width = style.width ? parseInt(style.width) : 400;
    const height = style.height ? parseInt(style.height) : 300;
    return { width, height };
  };
  
  const initialDimensions = getInitialDimensions();
  const baseWidth = 500;
  const currentWidth = size?.width ?? initialDimensions.width;
  const scaleFactor = currentWidth / baseWidth;

  // Extract width/height from style to use only as initial values
  const { width: styleWidth, height: styleHeight, ...restStyle } = style;
  
  const windowStyle = {
    position: 'fixed',
    zIndex,
    ...restStyle,  // Apply other styles first
    ...(position ? {
      left: position.x,
      top: position.y,
      bottom: 'auto',
      right: 'auto',
    } : initialPosition),
    width: size?.width ?? styleWidth ?? 400,
    height: size?.height ?? styleHeight ?? 300,
  };

  return (
    <div 
      ref={windowRef} 
      style={windowStyle} 
      className={className}
      onMouseDownCapture={() => onFocus && onFocus()}
      onTouchStartCapture={() => onFocus && onFocus()}
      onMouseDown={dragAnywhere ? handleMouseDown : undefined}
      onTouchStart={dragAnywhere ? handleTouchStart : undefined}
    >
      <div className="window" style={{ margin: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div 
          className="title-bar"
          onMouseDown={!dragAnywhere ? handleMouseDown : undefined}
          onTouchStart={!dragAnywhere ? handleTouchStart : undefined}
          onDoubleClick={handleReset}
          style={{ cursor: isDragging ? 'grabbing' : 'grab', flexShrink: 0 }}
        >
          <button 
            aria-label="Close" 
            className="close" 
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          ></button>
          <h1 className="title" style={{ fontSize: '12px' }}>{title}</h1>
          <button aria-label="Resize" disabled className="hidden"></button>
        </div>
        <div className="separator" style={{ flexShrink: 0 }}></div>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            width: `${100 / scaleFactor}%`,
            height: `${100 / scaleFactor}%`,
            transform: `scale(${scaleFactor})`,
            transformOrigin: 'top left',
          }}>
            {children}
          </div>
          {resizable && (
            <div
              onMouseDown={handleResizeMouseDown}
              onTouchStart={handleResizeTouchStart}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '20px',
                height: '20px',
                cursor: 'nwse-resize',
                background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%)',
                touchAction: 'none',
                zIndex: 10,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
