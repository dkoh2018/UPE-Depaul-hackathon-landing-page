import React, { useState, useEffect } from 'react';
import Draggable from './Draggable';
import { Z_INDEX } from '../../constants';

export default function DraggableArrow() {
  const [scale, setScale] = useState(1);
  const [initialPosition, setInitialPosition] = useState({ x: 45, y: 120 });

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth <= 430) {
        setScale(0.6);
        setInitialPosition({ x: 35, y: 80 });
      } else if (window.innerWidth <= 768) {
        setScale(0.8);
        setInitialPosition({ x: 85, y: 120 });
      } else {
        setScale(1);
        setInitialPosition({ x: 85, y: 120 });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <Draggable 
      initialPos={initialPosition} 
      zIndex={Z_INDEX.ARROW}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
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
    </Draggable>
  );
}
