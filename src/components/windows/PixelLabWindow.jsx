import React, { useState, useEffect } from 'react';
import PixelCharacters from '../PixelCharacters';
import { Z_INDEX } from '../../constants';
import DraggableWindow from './DraggableWindow';

export default function PixelLabWindow({ onClose, zIndex, onFocus, initialPosition }) {
  const [windowSize, setWindowSize] = useState({ width: 500, height: 404 });
  
  useEffect(() => {
    const calculateSize = () => {
      const vw = window.innerWidth;
      if (vw >= 1400) setWindowSize({ width: 550, height: 440 }); 
      else if (vw >= 1200) setWindowSize({ width: 500, height: 400 });
      else if (vw >= 992) setWindowSize({ width: 450, height: 360 });
      else if (vw >= 768) setWindowSize({ width: 400, height: 320 });
      else setWindowSize({ width: 320, height: 256 });
    };
    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  return (
    <DraggableWindow
      title="hackathon_lab.exe"
      initialPosition={initialPosition || (window.innerWidth < 500 ? { bottom: '5%', right: '2%' } : { bottom: '15%', right: '5%' })}
      style={{ width: `${windowSize.width}px`, height: `${windowSize.height}px` }}
      zIndex={zIndex || Z_INDEX.WINDOWS_BASE}
      resizable={true} 
      onClose={onClose}
      onFocus={onFocus}
      dragAnywhere={true}
    >
      <div style={{ 
        background: '#d4d0c8',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <PixelCharacters count={3} />
        
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 999,
            background: `
                linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))
            `,
            backgroundSize: '100% 2px, 3px 100%',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)', 
        }} />
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1000,
            background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)'
        }} />
      </div>
    </DraggableWindow>
  );
}