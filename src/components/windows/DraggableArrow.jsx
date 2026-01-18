import React, { useState, useEffect } from 'react';
import Draggable from './Draggable';
import { Z_INDEX } from '../../constants';

export default function DraggableArrow() {
  const [scale, setScale] = useState(1);
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

  return (
    <Draggable 
      initialPos={initialPos} 
      zIndex={Z_INDEX.ARROW}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
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
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
          <img 
            src="/images/argonne-national-laboratory.png"
            alt="Argonne National Laboratory"
            draggable={false}
            style={{ width: '140px', height: 'auto', pointerEvents: 'none', filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' }}
          />
          <img 
            src="/images/CDMLogo.png"
            alt="DePaul CDM"
            draggable={false}
            style={{ width: '80px', height: 'auto', pointerEvents: 'none', filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' }}
          />
          <img 
            src="/images/Microsoft_logo.svg"
            alt="Microsoft"
            draggable={false}
            style={{ width: '100px', height: 'auto', pointerEvents: 'none', filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' }}
          />
        </div>
      </div>
    </Draggable>
  );
}
