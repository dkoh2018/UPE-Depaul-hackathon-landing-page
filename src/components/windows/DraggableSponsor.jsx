import React, { useState, useEffect } from 'react';
import Draggable from './Draggable';
import { Z_INDEX } from '../../constants';

export default function DraggableSponsor({ src, alt, initialPos, width, dropShadow = true }) {
  const [currentWidth, setCurrentWidth] = useState(width);

  useEffect(() => {
    const updateSize = () => {
      // Responsive scaling logic
      if (window.innerWidth <= 430) setCurrentWidth(width * 0.75);
      else if (window.innerWidth <= 768) setCurrentWidth(width * 0.8);
      else setCurrentWidth(width);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [width]);

  return (
    <Draggable 
      initialPos={initialPos} 
      zIndex={Z_INDEX.ARROW}
    >
      <img 
        src={src}
        alt={alt}
        draggable={false}
        style={{
          width: `${currentWidth}px`,
          height: 'auto',
          pointerEvents: 'none',
          filter: dropShadow ? 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' : 'none',
          userSelect: 'none'
        }}
      />
    </Draggable>
  );
}
