import React, { useState, useCallback, useEffect, useRef } from 'react';

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

  const updatePosition = useCallback((clientX, clientY) => {
    if (!isDragging) return;
    
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;
    const constrainedX = Math.max(-50, Math.min(window.innerWidth - 50, newX));
    const constrainedY = Math.max(0, Math.min(window.innerHeight - 50, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  }, [isDragging, dragOffset]);

  const handleMouseMove = useCallback((e) => {
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handleTouchMove = useCallback((e) => {
    if (e.cancelable) e.preventDefault();
    
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  }, [updatePosition]);

  const stopDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastTouchRef.current < 300) {
        setPosition(null);
        return;
      }
      lastTouchRef.current = now;

      const touch = e.touches[0];
      const currentX = position?.x ?? initialPos.x;
      const currentY = position?.y ?? initialPos.y;
      
      setDragOffset({ x: touch.clientX - currentX, y: touch.clientY - currentY });
      setIsDragging(true);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
    };
  }, [position, initialPos]);

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
    ...(position ? { left: position.x, top: position.y } : { left: initialPos.x, top: initialPos.y }),
  };

  return (
    <div 
      ref={elementRef}
      style={containerStyle}
      className={className} 
      onMouseDown={handleMouseDown}
      onDoubleClick={handleReset}
    >
      {children}
    </div>
  );
}
