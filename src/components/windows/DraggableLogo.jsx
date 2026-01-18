import React, { useState, useEffect } from 'react';
import Draggable from './Draggable';
import { Z_INDEX } from '../../constants';

export default function DraggableLogo() {
  const [logoSize, setLogoSize] = useState(100);
  const [initialPosition, setInitialPosition] = useState({ x: 35, y: 50 });

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth <= 430) {
        setLogoSize(50);
        setInitialPosition({ x: 35, y: 50 });
      } else if (window.innerWidth <= 768) {
        setLogoSize(70);
        setInitialPosition({ x: 75, y: 50 });
      } else {
        setLogoSize(100);
        setInitialPosition({ x: 75, y: 50 });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <Draggable 
      initialPos={initialPosition} 
      zIndex={Z_INDEX.LOGO}
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
    </Draggable>
  );
}
