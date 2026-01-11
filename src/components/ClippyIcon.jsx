import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ClippyIcon.css';

const CLIPPY_MESSAGES = [
  "It looks like you have questions! 🤔",
  "Need help? Click me!",
  "First hackathon? I got you!",
  "Click me for FAQ!",
  "Stuck? Let me help!",
  "Pro tip: Read the FAQ! 📖",
];

const IPHONE_MAX_WIDTH = 430;

export default function ClippyAssistant({ onClick, isFaqOpen }) {
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

  const startCycle = useCallback(() => {
    if (isFaqOpen) return;
    
    clearAllTimers();
    setClipState('entering');
    
    timersRef.current.push(setTimeout(() => setClipState('visible'), 100));
    
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
    setShowBubble(false);
    onClick && onClick();
  };

  if (clipState === 'hidden' || (clipState === 'exiting' && isFaqOpen)) {
    if (isFaqOpen) return null;
  }

  return (
    <div 
      className={`clippy-assistant clippy-${clipState} ${hiddenByScroll ? 'clippy-scroll-hidden' : ''}`} 
      onClick={handleClick}
    >
      {showBubble && clipState === 'visible' && !isFaqOpen && !hiddenByScroll && (
        <div className="clippy-bubble">
          {message}
        </div>
      )}
      <div className="clippy-float">
        <img src="/images/clippy-head-scratch.gif" alt="Clippy FAQ Assistant" />
      </div>
    </div>
  );
}
