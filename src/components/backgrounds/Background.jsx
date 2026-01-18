import React, { useState, useEffect } from 'react'
import { CodeEditorWindow, PixelLabWindow, SuperHackathonBrosWindow, DraggableLogo, DraggableArrow, DraggableSponsor, CountdownWindow, TextWindow } from '../windows'
import DesktopIcons from '../DesktopIcons'
import ClippyAssistant from '../ClippyIcon'

import { Z_INDEX } from '../../constants';

export default function Background({ children, pattern = 'scanlines', showCodeBoxes = true }) {
  const [showPixelLab, setShowPixelLab] = useState(true);
  const [showSuperBros, setShowSuperBros] = useState(true);
  const [showCountdown, setShowCountdown] = useState(true);
  const [showCodeEditor, setShowCodeEditor] = useState(true);
  const [showTrashWindow, setShowTrashWindow] = useState(false);
  const [showScheduleWindow, setShowScheduleWindow] = useState(false);
  const [showFaqWindow, setShowFaqWindow] = useState(false);

  const [windowsCleared, setWindowsCleared] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [windowResetKey, setWindowResetKey] = useState(0);
  const [popupStack, setPopupStack] = useState([]);

  const [windowStack, setWindowStack] = useState(['code', 'pixel', 'super', 'countdown']);
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
      const codeStartTop = isMobile ? 300 : 500;
      const gap = 55;

      const rightMargin = isMobile ? '5%' : '8%';

      const labPos = { top: startTop, right: rightMargin };
      const countdownPos = { top: startTop + superHeight + gap, right: rightMargin };
      const codePos = { top: startTop + superHeight + gap + countdownHeight + gap, right: rightMargin };

      const superPos = isMobile ? { top: '50%', left: '2%' } : { top: codeStartTop + 100, left: '5%' };

      const countdownCenteredPos = {
        top: isMobile ? '58%' : '48%',
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto'
      };

      setWindowPositions({
        super: superPos,
        countdown: countdownPos,
        countdownCentered: countdownCenteredPos,
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

  const handleFaqClick = () => {
    setShowFaqWindow(true);
    bringPopupToFront('faq');
  };



  const handleClearDesktop = () => {
    if (windowsCleared) {
      setShowPixelLab(true);
      setShowSuperBros(true);
      setShowCodeEditor(true);
      setShowCountdown(true);
      setFormResetKey(prev => prev + 1);
      setWindowResetKey(prev => prev + 1);
      setWindowsCleared(false);
    } else {
      setShowPixelLab(false);
      setShowSuperBros(false);
      setShowCodeEditor(false);
      setShowTrashWindow(false);
      setShowScheduleWindow(false);
      setWindowResetKey(prev => prev + 1);
      setWindowsCleared(true);
    }
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
          {showCodeEditor && (
            <CodeEditorWindow 
              key={`code-${windowResetKey}`}
              zIndex={getZIndex('code')} 
              onFocus={() => bringToFront('code')}
              initialPosition={windowPositions.code}
            />
          )}
          {showPixelLab && (
            <PixelLabWindow 
              key={`pixel-${windowResetKey}`}
              onClose={() => setShowPixelLab(false)} 
              zIndex={getZIndex('pixel')}
              onFocus={() => bringToFront('pixel')}
              initialPosition={windowPositions.pixel}
            />
          )}
          {showSuperBros && (
            <SuperHackathonBrosWindow 
              key={`super-${windowResetKey}`}
              onClose={() => setShowSuperBros(false)} 
              zIndex={getZIndex('super')}
              onFocus={() => bringToFront('super')}
              initialPosition={windowPositions.super}
            />
          )}
          <DraggableLogo key={`logo-${windowResetKey}`} />
          <DraggableArrow key={`arrow-${windowResetKey}`} />
          
          {/* Independent Sponsor Logos */}
          <DraggableSponsor 
            key={`sponsor-argonne-${windowResetKey}`}
            src="/images/argonne-national-laboratory.png"
            alt="Argonne National Laboratory"
            initialPos={{ x: 60, y: 220 }}
            width={180}
          />
          <DraggableSponsor 
            key={`sponsor-cdm-${windowResetKey}`}
            src="/images/CDMLogo.png"
            alt="DePaul CDM"
            initialPos={{ x: 90, y: 300 }}
            width={110}
          />
          <DraggableSponsor 
            key={`sponsor-microsoft-${windowResetKey}`}
            src="/images/Microsoft_logo.svg"
            alt="Microsoft"
            initialPos={{ x: 80, y: 380 }}
            width={140}
          />
          {showTrashWindow && (
            <TextWindow 
              title="trash"
              content="your code (jk)"
              onClose={() => setShowTrashWindow(false)} 
              zIndex={getPopupZIndex('trash')}
              onFocus={() => bringPopupToFront('trash')}
              width={380}
              height={280}
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
              /*
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
              */
              content={`TBA`}
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
              key={`countdown-${windowResetKey}`}
              onClose={() => setShowCountdown(false)} 
              zIndex={getZIndex('countdown')}
              onFocus={() => bringToFront('countdown')}
              initialPosition={windowsCleared ? windowPositions.countdownCentered : windowPositions.countdown}
            />
          )}
          {showFaqWindow && (
            <TextWindow 
              title="faq.txt"
              content={`========================================
DEMONHACKS 2026 - FAQ
========================================

Q: Who can participate?
A: All students are welcome! Whether you're a beginner or experienced developer, DemonHacks is open to DePaul and non-DePaul students from all around the ChicagoLand area. All skill levels and majors are welcome!

Q: How much does it cost?
A: Participation is completely free! We provide meals, snacks, swag, and an amazing experience at no cost to you.

Q: Do I need a team?
A: Yes! Teams must have a minimum of 2 people and a maximum of 6 people. We'll have team formation activities at the start of the event if you're looking for teammates.

Q: What should I bring?
A: Bring your laptop, charger, student ID, and enthusiasm! If you plan to stay overnight, we recommend bringing a blanket, pillow, or sleeping bag. We'll provide everything else including food, drinks, and workspace.

Q: Where is the venue?
A: DemonHacks will be held at DePaul's CDM (College of Computing and Digital Media) building, located at 243 S Wabash Ave, Chicago, IL 60604. The venue is fully accessible.

Q: Is this beginner-friendly?
A: Absolutely! We'll have beginner-friendly workshops, mentors to help you, and resources for first-time hackers. This is a great place to learn and build your first project.

Q: Is the venue accessible?
A: Yes, our venue is fully accessible. If you need specific accommodations, please contact us at deltaupe@cdm.depaul.edu or cssociety@depaul.edu.

Q: Can I work on an existing project?
A: All projects must be started from scratch at the hackathon. You can use existing libraries, frameworks, and APIs, but the core project work must be done during the event.

========================================
`}
              onClose={() => setShowFaqWindow(false)} 
              zIndex={getPopupZIndex('faq')}
              onFocus={() => bringPopupToFront('faq')}
              width={Math.min(750, window.innerWidth * 0.9)}
              height={Math.min(800, window.innerHeight * 0.85)}
              fontSize={window.innerWidth < 500 ? 16 : 12}
              useThemedScrollbar={true}
              boldTimes={true}
              resizable={false}
              initialPosition={{ 
                top: Math.max(30, window.innerHeight * 0.08), 
                left: (window.innerWidth - Math.min(750, window.innerWidth * 0.9)) / 2
              }}
            />
          )}
        </>
      )}
      <ClippyAssistant 
        onFaqClick={handleFaqClick} 
        onClearDesktop={handleClearDesktop}
        isFaqOpen={showFaqWindow}
        windowsCleared={windowsCleared}
      />
      <div 
        key={formResetKey}
        style={{
          ...contentStyle,
          visibility: windowsCleared ? 'hidden' : 'visible',
          opacity: windowsCleared ? 0 : 1,
        }}
      >
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
