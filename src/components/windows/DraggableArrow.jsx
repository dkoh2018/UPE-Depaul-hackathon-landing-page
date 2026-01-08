import React, { useState, useCallback, useEffect, useRef } from 'react';

export default function DraggableArrow() {
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const elementRef = useRef(null);

  const initialPos = { x: 45, y: 120 };

  useEffect(() => {
    const updateSize = () => {

      if (window.innerWidth <= 430) setScale(0.6);
      else if (window.innerWidth <= 768) setScale(0.8);
      else setScale(1);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const startDrag = useCallback((clientX, clientY) => {
    const rect = elementRef.current.getBoundingClientRect();
    const currentX = position?.x ?? initialPos.x;
    const currentY = position?.y ?? initialPos.y;
    
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
    zIndex: 30,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    ...(position ? { left: position.x, top: position.y } : { left: initialPos.x, top: initialPos.y }),
  };

  return (
    <div 
      ref={elementRef}
      style={containerStyle} 
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
        <img 
            src="/images/click_here_to_drag.png"
            alt="Click here to drag"
            draggable={false}
            style={{
                width: '240px',
                height: 'auto',
                pointerEvents: 'none',
                display: 'block'
            }}
        />
    </div>
  );
}
