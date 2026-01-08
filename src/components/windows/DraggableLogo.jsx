import React, { useState, useCallback, useEffect, useRef } from 'react';

export default function DraggableLogo() {
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [logoSize, setLogoSize] = useState(100);
  const elementRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth <= 430) setLogoSize(50);
      else if (window.innerWidth <= 768) setLogoSize(70);
      else setLogoSize(100);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const startDrag = useCallback((clientX, clientY) => {
    const rect = elementRef.current.getBoundingClientRect();
    const currentX = position?.x ?? rect.left;
    const currentY = position?.y ?? rect.top;
    
    setDragOffset({ x: clientX - currentX, y: clientY - currentY });
    setIsDragging(true);
  }, [position]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  }, [startDrag]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
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
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', stopDrag);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, stopDrag]);

  const containerStyle = {
    position: 'fixed',
    zIndex: 200,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    ...(position ? { left: position.x, top: position.y } : { top: 50, left: 35 }),
  };

  return (
    <div 
      ref={elementRef}
      style={containerStyle} 
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <img 
        src="/images/depaul-logo.png" 
        alt="DePaul University"
        draggable={false}
        style={{
          width: `${logoSize}px`,
          height: 'auto',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

