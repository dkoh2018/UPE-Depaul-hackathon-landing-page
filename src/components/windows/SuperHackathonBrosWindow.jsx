import React, { useState, useEffect } from 'react';
import SuperHackathonBros from '../SuperHackathonBros';
import { Z_INDEX } from '../../constants';
import DraggableWindow from './DraggableWindow';

export default function SuperHackathonBrosWindow({ onClose, zIndex, onFocus }) {
  const [windowSize, setWindowSize] = useState({ width: 500, height: 404 });
  
  useEffect(() => {
    const calculateSize = () => {
      const vw = window.innerWidth;
      
      if (vw >= 1400) setWindowSize({ width: 325, height: 250 });
      else if (vw >= 1200) setWindowSize({ width: 300, height: 230 });
      else if (vw >= 992) setWindowSize({ width: 275, height: 210 });
      else setWindowSize({ width: 250, height: 190 });
    };
    calculateSize();
  }, []);

  return (
    <DraggableWindow
      title="super_hackathon_bros.exe"
      initialPosition={{ top: 110, right: 165 }}
      style={{ width: `${windowSize.width}px`, height: `${windowSize.height}px` }}
      zIndex={zIndex || Z_INDEX.WINDOWS_BASE}
      onFocus={onFocus}
      resizable={true}
      onClose={onClose}
      dragAnywhere={true}
    >
      <div style={{ 
        background: '#000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}>
        <SuperHackathonBros />
      </div>
    </DraggableWindow>
  );
}
