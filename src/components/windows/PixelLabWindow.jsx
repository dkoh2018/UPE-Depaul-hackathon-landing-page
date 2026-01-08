import React, { useState, useEffect } from 'react';
import PixelCharacters from '../PixelCharacters';
import DraggableWindow from './DraggableWindow';

export default function PixelLabWindow() {
  const [windowSize, setWindowSize] = useState({ width: 500, height: 404 });
  
  useEffect(() => {
    const calculateSize = () => {
      const vw = window.innerWidth;
      if (vw >= 1400) setWindowSize({ width: 650, height: 525 });
      else if (vw >= 1200) setWindowSize({ width: 600, height: 485 });
      else if (vw >= 992) setWindowSize({ width: 550, height: 444 });
      else setWindowSize({ width: 500, height: 404 });
    };
    calculateSize();
  }, []);

  return (
    <DraggableWindow
      title="hackathon_lab.exe"
      initialPosition={{ bottom: 60, right: 200 }}
      style={{ width: `${windowSize.width}px`, height: `${windowSize.height}px` }}
      zIndex={45}
      resizable={true}
    >
      <div style={{ 
        background: '#d4d0c8', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}>
        <PixelCharacters count={3} />
      </div>
    </DraggableWindow>
  );
}
