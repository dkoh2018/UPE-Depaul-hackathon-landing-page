import React, { useState, useEffect } from 'react';
import DraggableWindow from './DraggableWindow';
import { Z_INDEX } from '../../constants';

export default function CountdownWindow({ onClose, zIndex, onFocus, initialPosition }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-02-28T12:00:00-06:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((distance % 1000) / 10); // divide by 10 to get 2 digits (0-99)

        setTimeLeft({ days, hours, minutes, seconds, milliseconds });
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value) => String(value).padStart(2, '0');
  const formatMs = (value) => String(value).padStart(2, '0');

  return (
    <DraggableWindow
      title="count_dwn.exe"
      initialPosition={initialPosition || (window.innerWidth < 500 ? { top: '5%', right: '2%' } : { top: '40%', right: '3%' })}
      style={{ width: '300px', height: '100px' }}
      zIndex={zIndex || Z_INDEX.COUNTDOWN}
      resizable={true}
      onClose={onClose}
      onFocus={onFocus}
      dragAnywhere={true}
    >
      <div style={{
        background: '#fff',
        color: '#000',
        width: '500px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
        boxSizing: 'border-box'
      }}>
        <style>{`
          .retro-counter {
            font-family: 'Courier New', monospace !important;
            font-variant-numeric: tabular-nums;
          }
        `}</style>
        <div className="retro-counter" style={{
          display: 'flex',
          alignItems: 'baseline',
          fontSize: '64px',
          fontWeight: 'bold',
          gap: '4px',
          letterSpacing: '-2px',
          lineHeight: 1
        }}>
          <div>{formatTime(timeLeft.days)}:</div>
          <div>{formatTime(timeLeft.hours)}:</div>
          <div>{formatTime(timeLeft.minutes)}:</div>
          <div>{formatTime(timeLeft.seconds)}</div>
          <div style={{ fontSize: '42px', marginLeft: '4px', width: '80px', textAlign: 'left' }}>.{formatMs(timeLeft.milliseconds)}</div>
        </div>
        <div className="retro-counter" style={{
            fontSize: '14px',
            marginTop: '0px',
            fontWeight: 'bold',
            letterSpacing: '4px',
            textTransform: 'uppercase'
        }}>
            until Feb 28
        </div>
      </div>
    </DraggableWindow>
  );
}
