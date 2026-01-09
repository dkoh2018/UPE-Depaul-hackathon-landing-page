import React, { useState, useEffect } from 'react'
import { CodeEditorWindow, PixelLabWindow, SuperHackathonBrosWindow, DraggableLogo, DraggableArrow, CountdownWindow } from '../windows'
import DesktopIcons from '../DesktopIcons'

import { Z_INDEX } from '../../constants';

export default function Background({ children, pattern = 'scanlines', showCodeBoxes = true }) {
  const [showPixelLab, setShowPixelLab] = useState(true);
  const [showSuperBros, setShowSuperBros] = useState(true);
  const [showCountdown, setShowCountdown] = useState(true);

  const [windowStack, setWindowStack] = useState(['code', 'pixel', 'super']);

  useEffect(() => {
    document.body.style.backgroundColor = '#c0c0c0';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const bringToFront = (id) => {
    setWindowStack((prev) => {
      if (prev[prev.length - 1] === id) return prev;
      return [...prev.filter(winId => winId !== id), id];
    });
  };

  const getZIndex = (id) => {
     const index = windowStack.indexOf(id);
     return Z_INDEX.WINDOWS_BASE + index;
  };

  return (
    <div style={wrapperStyle} className="no-scrollbar">
      <div style={getPatternStyle('noise')} />
      <DesktopIcons />
      {showCodeBoxes && (
        <>
          <CodeEditorWindow 
            zIndex={getZIndex('code')} 
            onFocus={() => bringToFront('code')}
          />
          {showPixelLab && (
            <PixelLabWindow 
              onClose={() => setShowPixelLab(false)} 
              zIndex={getZIndex('pixel')}
              onFocus={() => bringToFront('pixel')}
            />
          )}
          {showSuperBros && (
            <SuperHackathonBrosWindow 
              onClose={() => setShowSuperBros(false)} 
              zIndex={getZIndex('super')}
              onFocus={() => bringToFront('super')}
            />
          )}
          <DraggableLogo />
          <DraggableArrow />
          {showCountdown && (
            <CountdownWindow 
              onClose={() => setShowCountdown(false)} 
              zIndex={Z_INDEX.COUNTDOWN}
            />
          )}
        </>
      )}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  )
}

const wrapperStyle = {
  position: 'relative',
  minHeight: '100vh',
  minWidth: '100vw',
  height: '100vh',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  backgroundColor: '#c0c0c0',
}

const contentStyle = {
  position: 'relative',
  zIndex: 100,
  pointerEvents: 'none',
}

function getPatternStyle(pattern) {
  const baseStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
  }

  switch (pattern) {
    case 'scanlines':
      return {
        ...baseStyle,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px)',
      }
    case 'noise':
      return {
        ...baseStyle,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.20,
      }
    case 'grid':
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }
    case 'dots':
      return {
        ...baseStyle,
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,.08) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }
    default:
      return baseStyle
  }
}
