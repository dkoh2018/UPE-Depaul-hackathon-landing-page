import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ClippyIcon.css';

const CLIPPY_MESSAGES = [
  "DONT CLICK ON ME",
  "Read the FAQ!",
  "Double click a window to reset it!",
];

const IPHONE_MAX_WIDTH = 430;

export default function ClippyAssistant({ onFaqClick, onClearDesktop, isFaqOpen, windowsCleared }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [message, setMessage] = useState(CLIPPY_MESSAGES[0]);
  const [clipState, setClipState] = useState('entering');
  const [cycleCount, setCycleCount] = useState(0);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const timersRef = useRef([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const clippyRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    
    const handleClickOutside = (e) => {
      if (clippyRef.current && !clippyRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    const checkIfAtBottom = () => {
      if (window.innerWidth > IPHONE_MAX_WIDTH) {
        setHiddenByScroll(false);
        return;
      }

      const scrollContainer = document.querySelector('.no-scrollbar') || document.documentElement;
      const scrollTop = scrollContainer.scrollTop || window.scrollY;
      const scrollHeight = scrollContainer.scrollHeight || document.documentElement.scrollHeight;
      const clientHeight = scrollContainer.clientHeight || window.innerHeight;
      
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isAtBottom = distanceFromBottom < 50;
      
      setHiddenByScroll(isAtBottom);
    };

    const scrollContainer = document.querySelector('.no-scrollbar') || window;
    scrollContainer.addEventListener('scroll', checkIfAtBottom, { passive: true });
    window.addEventListener('resize', checkIfAtBottom, { passive: true });
    
    checkIfAtBottom();

    return () => {
      scrollContainer.removeEventListener('scroll', checkIfAtBottom);
      window.removeEventListener('resize', checkIfAtBottom);
    };
  }, []);

  const startCycle = useCallback((skipEntrance = false) => {
    if (isFaqOpen) return;
    
    clearAllTimers();
    
    if (!skipEntrance) {
      setClipState('entering');
      timersRef.current.push(setTimeout(() => setClipState('visible'), 100));
    } else {
      setClipState('visible');
    }
    
    timersRef.current.push(setTimeout(() => {
      setShowBubble(true);
      setMessage(CLIPPY_MESSAGES[Math.floor(Math.random() * CLIPPY_MESSAGES.length)]);
    }, 1500));
    
    timersRef.current.push(setTimeout(() => setShowBubble(false), 5000));
    
    timersRef.current.push(setTimeout(() => {
      setShowBubble(false);
      setClipState('exiting');
    }, 30000));
    
    timersRef.current.push(setTimeout(() => {
      setClipState('hidden');
      timersRef.current.push(setTimeout(() => {
        setCycleCount(c => c + 1);
      }, 2000));
    }, 30800));
  }, [isFaqOpen, clearAllTimers]);

  useEffect(() => {
    if (isFaqOpen) {
      clearAllTimers();
      setShowBubble(false);
      setClipState('exiting');
    } else {
      setTimeout(() => startCycle(), 500);
    }
  }, [isFaqOpen, clearAllTimers, startCycle]);

  useEffect(() => {
    if (!isFaqOpen) {
      startCycle();
    }
  }, [cycleCount]);

  useEffect(() => {
    if (clipState !== 'visible' || isFaqOpen) return;
    
    const interval = setInterval(() => {
      const randomMessage = CLIPPY_MESSAGES[Math.floor(Math.random() * CLIPPY_MESSAGES.length)];
      setMessage(randomMessage);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 4000);
    }, 5000);

    return () => clearInterval(interval);
  }, [clipState, isFaqOpen]);

  const handleClick = () => {
    if (isFaqOpen) return;
    
    // Stop the auto-hide cycle when user interacts
    clearAllTimers();
    setClipState('visible');
    
    setShowBubble(false);
    setShowMenu(!showMenu);
    
    // If closing menu (toggle), restart cycle? 
    // Maybe best to just leave him visible until next interaction or effect dependency update
    if (showMenu) {
      // If we are closing the menu, we might want to restart the cycle or just let the effect handle it
      // The useEffect on [cycleCount] or [isFaqOpen] might pick it up if we change something?
      // Simple fix: just clear/visible is enough to prevent the "disappear" bug.
      // We can let the existing useEffects restart cycle if need be, but for now just keeping him visible is safer.
      setTimeout(() => startCycle(true), 500); 
    }
  };

  const handleMenuOption = (action) => {
    setShowMenu(false);
    const actions = { faq: onFaqClick, clear: onClearDesktop };
    actions[action]?.();
  };

  if (clipState === 'hidden' || (clipState === 'exiting' && isFaqOpen)) {
    if (isFaqOpen) return null;
  }

  return (
    <div 
      ref={clippyRef}
      className={`clippy-assistant clippy-${clipState} ${hiddenByScroll ? 'clippy-scroll-hidden' : ''}`} 
      onClick={handleClick}
    >
      {showBubble && clipState === 'visible' && !isFaqOpen && !hiddenByScroll && !showMenu && (
        <div className="clippy-bubble">
          {message}
        </div>
      )}
      {showMenu && clipState === 'visible' && !hiddenByScroll && (
        <div className="clippy-menu">
          <div className="clippy-menu-header">How can I help?</div>
          <div className="clippy-menu-options">
            <button className="clippy-menu-option" onClick={() => handleMenuOption('faq')}>
              <span className="clippy-menu-icon">❓</span>
              <span>FAQ</span>
            </button>
            <button className="clippy-menu-option" onClick={() => handleMenuOption('clear')}>
              <span className="clippy-menu-icon">{windowsCleared ? '🪟' : '🧹'}</span>
              <span>{windowsCleared ? 'Show All Windows' : 'Clear All Windows'}</span>
            </button>
          </div>
        </div>
      )}
      <div className={`clippy-float ${showMenu ? 'clippy-menu-open' : ''}`}>
        <img src="/images/clippy-head-scratch.gif" alt="Clippy FAQ Assistant" />
      </div>
    </div>
  );
}
