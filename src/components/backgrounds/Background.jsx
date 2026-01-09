import React, { useState, useEffect } from 'react'
import { CodeEditorWindow, PixelLabWindow, SuperHackathonBrosWindow, DraggableLogo, DraggableArrow, CountdownWindow, TextWindow } from '../windows'
import DesktopIcons from '../DesktopIcons'

import { Z_INDEX } from '../../constants';

export default function Background({ children, pattern = 'scanlines', showCodeBoxes = true }) {
  const [showPixelLab, setShowPixelLab] = useState(true);
  const [showSuperBros, setShowSuperBros] = useState(true);
  const [showCountdown, setShowCountdown] = useState(true);
  const [showTrashWindow, setShowTrashWindow] = useState(false);
  const [showScheduleWindow, setShowScheduleWindow] = useState(false);

  const [windowStack, setWindowStack] = useState(['code', 'pixel', 'super']);
  const [windowPositions, setWindowPositions] = useState({});

  useEffect(() => {
    const calculateLayout = () => {
      const vw = window.innerWidth;
      const isMobile = vw < 500;
      
      // Define heights based on component logic
      let superHeight, labHeight;
      const countdownHeight = 100;

      if (isMobile) {
        superHeight = 190;
        labHeight = 224;
      } else {
        if (vw >= 1400) { superHeight = 250; labHeight = 320; }
        else if (vw >= 1200) { superHeight = 230; labHeight = 280; }
        else if (vw >= 992) { superHeight = 210; labHeight = 256; }
        else { superHeight = 190; labHeight = 224; }
      }

      // Calculate vertical stack
      const startTop = isMobile ? 120 : 210;
      const gap = 55; // Further increased space between windows

      const rightMargin = isMobile ? '5%' : '8%';

      const superPos = { top: startTop, right: rightMargin };
      const countdownPos = { top: startTop + superHeight + gap, right: rightMargin };
      const labPos = { top: startTop + superHeight + gap + countdownHeight + gap, right: rightMargin };

      // Code Editor on the left
      const codePos = isMobile ? { top: '50%', left: '2%' } : { top: '30%', left: '5%' };

      setWindowPositions({
        super: superPos,
        countdown: countdownPos,
        pixel: labPos,
        code: codePos
      });
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = '#c0c0c0';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleTrashClick = () => {
    setShowTrashWindow(true);
    bringToFront('trash');
  };

  const handleScheduleClick = () => {
    setShowScheduleWindow(true);
    bringToFront('schedule');
  };

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
      <DesktopIcons onTrashClick={handleTrashClick} onScheduleClick={handleScheduleClick} />
      {showCodeBoxes && (
        <>
          <CodeEditorWindow 
            zIndex={getZIndex('code')} 
            onFocus={() => bringToFront('code')}
            initialPosition={windowPositions.code}
          />
          {showPixelLab && (
            <PixelLabWindow 
              onClose={() => setShowPixelLab(false)} 
              zIndex={getZIndex('pixel')}
              onFocus={() => bringToFront('pixel')}
              initialPosition={windowPositions.pixel}
            />
          )}
          {showSuperBros && (
            <SuperHackathonBrosWindow 
              onClose={() => setShowSuperBros(false)} 
              zIndex={getZIndex('super')}
              onFocus={() => bringToFront('super')}
              initialPosition={windowPositions.super}
            />
          )}
          <DraggableLogo />
          <DraggableArrow />
          {showTrashWindow && (
            <TextWindow 
              title="trash"
              content="your code (jk)"
              onClose={() => setShowTrashWindow(false)} 
              zIndex={Z_INDEX.COUNTDOWN + 10}
              onFocus={() => bringToFront('trash')}
              width={300}
              height={200}
              initialPosition={{ 
                top: Math.max(80, window.innerHeight * 0.15), 
                left: Math.max(20, (window.innerWidth - 300) / 2 - 50) 
              }}
            />
          )}
          {showScheduleWindow && (
            <TextWindow 
              title="schedule.txt"
              content={`=======================================
DEMONHACKS 2026
SCHEDULE
THIS IS A TEST SCHEDULE THIS IS A TEST I REPEAT THIS IS A TEST
=======================================

FRIDAY, FEBRUARY 28, 2026
---------------------------------------
  |
  o  12:00 PM - 1:00 PM
  |  Opening & Introductions
  |
  o  1:00 PM - 11:00 PM
  |  Hacking Time!
  |
  o  11:00 PM - 12:00 AM
  |  Late Night Coding
  |  (or take a nap!)
  |
---------------------------------------
SATURDAY, MARCH 1, 2026
---------------------------------------
  |
  o  12:00 AM - 8:00 AM
  |  Code or Sleep
  |  (your choice!)
  |
  o  8:00 AM - 9:00 AM
  |  Breakfast
  |
  o  9:00 AM - 10:00 AM
  |  Final Coding Sprint
  |
  o  10:00 AM - 11:00 AM
  |  Project Submissions
  |
  o  11:00 AM - 11:30 AM
  |  Judging & Demos
  |
  o  11:30 AM - 12:00 PM
  |  Awards Ceremony
  |
  +-------------------------------------+
  |          END OF SCHEDULE            |
  +-------------------------------------+


`}
              onClose={() => setShowScheduleWindow(false)} 
              zIndex={Z_INDEX.COUNTDOWN + 11}
              onFocus={() => bringToFront('schedule')}
              width={450}
              height={600}
              fontSize={13}
              initialPosition={{ 
                top: Math.max(120, window.innerHeight * 0.15 + 60), 
                left: Math.max(20, (window.innerWidth - 450) / 2 + 50) 
              }}
            />
          )}
          {showCountdown && (
            <CountdownWindow 
              onClose={() => setShowCountdown(false)} 
              zIndex={Z_INDEX.COUNTDOWN}
              initialPosition={windowPositions.countdown}
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
