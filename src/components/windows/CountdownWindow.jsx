import React, { useState, useEffect } from 'react';
import DraggableWindow from './DraggableWindow';
import { Z_INDEX } from '../../constants';

export default function CountdownWindow({ onClose }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });

  useEffect(() => {
    // Target Date: Feb 28, 2026 12:00:00 PM CST (Chicago Time)
    // We explicitly set the offset to -06:00 (CST) so that this specific moment in time
    // is converted to a UTC timestamp.
    // Date.now() returns the current UTC timestamp from the device.
    // Calculating (Target UTC - Current UTC) ensures the countdown is the same duration
    // for everyone in the world, regardless of their local timezone.
    const targetDate = new Date('2026-02-28T12:00:00-06:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      } else {
        // Calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((distance % 1000) / 10); // divide by 10 to get 2 digits (0-99)

        setTimeLeft({ days, hours, minutes, seconds, milliseconds });
      }
    }, 10); // Update every 10ms

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value) => String(value).padStart(2, '0');
  const formatMs = (value) => String(value).padStart(2, '0');

  return (
    <DraggableWindow
      title="count_dwn.exe"
      initialPosition={{ top: 320, right: 30 }}
      style={{ width: '300px', height: '100px' }}
      zIndex={Z_INDEX.COUNTDOWN}
      resizable={true}
      onClose={onClose}
    >
      <div style={{
        background: '#fff',
        color: '#000',
        width: '500px', // Explicitly match baseWidth
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
          fontSize: '64px', // Much larger font to fill 500px
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
