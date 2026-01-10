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
  const [popupStack, setPopupStack] = useState([]);

  const [windowStack, setWindowStack] = useState(['code', 'pixel', 'super']);
  const [windowPositions, setWindowPositions] = useState({});

  useEffect(() => {
    const calculateLayout = () => {
      const vw = window.innerWidth;
      const isMobile = vw < 500;
      
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

      const startTop = isMobile ? 120 : 210;
      const gap = 55;

      const rightMargin = isMobile ? '5%' : '8%';

      const superPos = { top: startTop, right: rightMargin };
      const countdownPos = { top: startTop + superHeight + gap, right: rightMargin };
      const labPos = { top: startTop + superHeight + gap + countdownHeight + gap, right: rightMargin };

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
    bringPopupToFront('trash');
  };

  const handleScheduleClick = () => {
    setShowScheduleWindow(true);
    bringPopupToFront('schedule');
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

  const bringPopupToFront = (id) => {
    setPopupStack((prev) => {
      if (prev[prev.length - 1] === id) return prev;
      return [...prev.filter(p => p !== id), id];
    });
  };

  const getPopupZIndex = (id) => {
    const index = popupStack.indexOf(id);
    return Z_INDEX.POPUP_BASE + (index >= 0 ? index : 0);
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
              zIndex={getPopupZIndex('trash')}
              onFocus={() => bringPopupToFront('trash')}
              width={300}
              height={200}
              useThemedScrollbar={true}
              initialPosition={{ 
                top: Math.max(80, window.innerHeight * 0.15), 
                left: Math.max(20, (window.innerWidth - 300) / 2 - 50) 
              }}
            />
          )}
          {showScheduleWindow && (
            <TextWindow 
              title="schedule.txt"
              content={`==================================
DEMONHACKS 2026
OFFICIAL SCHEDULE
==================================
  +--------------------------------+
  |      SATURDAY, FEBRUARY 28, 2026      |
  +--------------------------------+
  |
  o    09:00 AM
  |    Check-in & Registration
  |    @ Lobby
  |
  o    10:00 AM
  |    Opening Ceremony
  |    @ Auditorium
  |
  o    11:00 AM
  |    >>> HACKING BEGINS <<<
  |    @ All Rooms
  |
  o    12:30 PM
  |    Lunch
  |    @ Cafeteria
  |
  o    02:00 PM
  |    Workshop: Intro to Web Dev
  |    @ Room 201
  |
  o    03:30 PM
  |    Workshop: APIs & Integrations
  |    @ Room 202
  |
  o    05:00 PM
  |    Team Formation & Networking
  |    @ Lounge
  |
  o    06:30 PM
  |    Dinner
  |    @ Cafeteria
  |
  o    08:00 PM
  |    Workshop: UI/UX Basics
  |    @ Room 201
  |
  o    11:00 PM
  |    Midnight Snack
  |    @ Lounge
  |
  +--------------------------------+
  |            SUNDAY, MARCH 1, 2026                |
  +--------------------------------+
  |
  o    08:00 AM
  |    Breakfast
  |    @ Cafeteria
  |
  o    10:00 AM
  |    Hacking Ends
  |    @ All Rooms
  |
  o    10:15 AM
  |    Project Submissions Due
  |    @ Devpost
  |
  o    11:00 AM
  |    Project Expo & Judging
  |    @ Main Hall
  |
  o    01:00 PM
  |    Lunch
  |    @ Cafeteria
  |
  o    02:00 PM
  |    Final Presentations
  |    @ Auditorium
  |
  o    03:30 PM
  |    Awards Ceremony
  |    @ Auditorium
  |
  o    04:30 PM
  |    Closing & Group Photo
  |    @ Auditorium
  |
  +-----------------------------+
  |                 END OF SCHEDULE                 |
  +-----------------------------+
`}
              onClose={() => setShowScheduleWindow(false)} 
              zIndex={getPopupZIndex('schedule')}
              onFocus={() => bringPopupToFront('schedule')}
              width={450}
              height={600}
              fontSize={13}
              useThemedScrollbar={true}
              boldTimes={true}
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
