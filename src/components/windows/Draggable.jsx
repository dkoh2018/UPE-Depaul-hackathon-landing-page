import React, { useState, useCallback, useEffect, useRef } from 'react';

/**
 * A reusable wrapper component that makes its children draggable.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be dragged.
 * @param {Object} props.initialPos - { x, y } coordinates for initial placement.
 * @param {Object} props.style - Additional inline styles for the container.
 * @param {string} props.className - Additional classes for the container.
 * @param {number} props.zIndex - Z-index for the container.
 */
export default function Draggable({ 
  children, 
  initialPos = { x: 0, y: 0 }, 
  style = {}, 
  className = '',
  zIndex = 10
}) {
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const lastTouchRef = useRef(0);

  const handleReset = useCallback(() => {
    setPosition(null);
  }, []);

  const startDrag = useCallback((clientX, clientY) => {
    const rect = elementRef.current.getBoundingClientRect();
    const currentX = position?.x ?? initialPos.x;
    const currentY = position?.y ?? initialPos.y;
    
    setDragOffset({ x: clientX - currentX, y: clientY - currentY });
    setIsDragging(true);
  }, [position, initialPos]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  }, [startDrag]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    
    // Double tap detection (300ms threshold)
    const now = Date.now();
    if (now - lastTouchRef.current < 300) {
      handleReset();
      return;
    }
    lastTouchRef.current = now;

    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, [startDrag, handleReset]);

  const updatePosition = useCallback((clientX, clientY) => {
    if (!isDragging) return;
    
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;
    // Constrain to window bounds with some padding
    const constrainedX = Math.max(-50, Math.min(window.innerWidth - 50, newX));
    const constrainedY = Math.max(0, Math.min(window.innerHeight - 50, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  }, [isDragging, dragOffset]);

  const handleMouseMove = useCallback((e) => {
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handleTouchMove = useCallback((e) => {
    // Prevent scrolling while dragging
    if (e.cancelable) e.preventDefault();
    
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  }, [updatePosition]);

  const stopDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', stopDrag);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', stopDrag);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, stopDrag]);

  const containerStyle = {
    position: 'fixed',
    zIndex,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    ...style,
    // Use state position if dragging has started, otherwise use initialPos
    ...(position ? { left: position.x, top: position.y } : { left: initialPos.x, top: initialPos.y }),
  };

  return (
    <div 
      ref={elementRef}
      style={containerStyle}
      className={className} 
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleReset}
    >
      {children}
    </div>
  );
}
