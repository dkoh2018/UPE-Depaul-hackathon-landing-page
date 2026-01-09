import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Z_INDEX } from '../../constants';
import { CodeBlock as CodeBlockPrimitive } from '@/components/animate-ui/primitives/animate/code-block';

const hackathonCode = `// DemonHacks 2026 - DePaul University
// Tracks: Smart City & Community Impact

import { useState } from 'react';
import type { Team, Alert } from './types';

// Smart City: traffic, energy, transit
function TrafficMonitor({ intersection }) {
  const [cars, setCars] = useState(0);
  const [signal, setSignal] = useState('red');

  const optimizeFlow = () => {
    if (cars > 10) {
      setSignal('green');
      console.log('🚦 Signal optimized');
    }
  };

  return { cars, signal, optimizeFlow };
}

// Community Impact: accessibility, safety
function SafetyAlert({ location, type }) {
  const [reported, setReported] = useState(false);

  const sendAlert = async () => {
    await fetch('/api/alerts', {
      method: 'POST',
      body: JSON.stringify({ location, type }),
    });
    setReported(true);
    console.log('📍 Alert sent!');
  };

  return { reported, sendAlert };
}

// Feb 28 - Mar 1, 2026 @ DePaul
export function DemonHacks() {
  const [team, setTeam] = useState(null);

  return <App team={team} />;
}`;

const typesCode = `// types.ts - DemonHacks 2026

export interface Team {
  name: string;
  members: string[];
  track: 'smart-city' | 'community';
}

export interface Alert {
  id: string;
  location: string;
  type: 'pothole' | 'light' | 'safety';
  timestamp: Date;
  resolved: boolean;
}

export interface Project {
  title: string;
  description: string;
  team: Team;
  demoUrl?: string;
  repoUrl?: string;
}

// Tracks available
export type Track = 
  | 'Smart City & Infrastructure'
  | 'Community & Social Impact';
`;

const codeFiles = [
  { name: 'hackathon.tsx', code: hackathonCode, icon: 'react' },
  { name: 'types.ts', code: typesCode, icon: 'ts' },
];

const VSCODE_COLORS = {
  background: '#1e1e1e',
  headerBg: '#252526',
  border: '#3c3c3c',
  textMuted: '#cccccc',
  accent: '#007acc',
  reactBlue: '#61DAFB',
};

function ReactIcon({ style }) {
  return (
    <svg style={{ width: '14px', height: '14px', flexShrink: 0, ...style }} viewBox="-11 -10.5 22 21" fill="currentColor">
      <circle r="2" />
      <g stroke="currentColor" fill="none" strokeWidth="1">
        <ellipse rx="10" ry="4.5" />
        <ellipse rx="10" ry="4.5" transform="rotate(60)" />
        <ellipse rx="10" ry="4.5" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function TsIcon({ style }) {
  return (
    <svg style={{ width: '14px', height: '14px', flexShrink: 0, ...style }} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#3178c6"/>
      <text x="5" y="17" fontSize="11" fontWeight="bold" fill="#fff">TS</text>
    </svg>
  );
}

export default function CodeEditorWindow({ zIndex, onFocus, dragAnywhere = true }) {
  const getInitialSize = () => {
    if (typeof window === 'undefined') return { width: 480, height: 560 };
    const vw = window.innerWidth;
    if (vw >= 1400) return { width: 600, height: 700 };
    if (vw >= 1200) return { width: 550, height: 642 };
    if (vw >= 992) return { width: 520, height: 607 };
    return { width: 480, height: 560 };
  };

  const initialSize = getInitialSize();
  const [position, setPosition] = useState(null);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const aspectRatio = useRef(initialSize.width / initialSize.height);
  const baseWidth = 480;
  const scaleFactor = size.width / baseWidth;

  const handleFileDone = useCallback(() => {
    if (activeIndex < codeFiles.length - 1) {
      setTimeout(() => setActiveIndex(prev => prev + 1), 1500);
    } else {
      setTimeout(() => setActiveIndex(0), 2000);
    }
  }, [activeIndex]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = position?.x ?? rect.left;
    const currentY = position?.y ?? rect.top;
    
    setDragOffset({ x: e.clientX - currentX, y: e.clientY - currentY });
    setIsDragging(true);
  }, [position]);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = position?.x ?? rect.left;
    const currentY = position?.y ?? rect.top;
    
    setDragOffset({ x: touch.clientX - currentX, y: touch.clientY - currentY });
    setIsDragging(true);
  }, [position]);

  const handleResizeMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
    setIsResizing(true);
  }, [size]);

  const handleResizeTouchStart = useCallback((e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: size.width,
      height: size.height,
    });
    setIsResizing(true);
  }, [size]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      const constrainedX = Math.max(-100, Math.min(window.innerWidth - 100, newX));
      const constrainedY = Math.max(0, Math.min(window.innerHeight - 50, newY));
      setPosition({ x: constrainedX, y: constrainedY });
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const delta = (deltaX + deltaY) / 2;
      
      const newWidth = Math.max(300, resizeStart.width + delta);
      const newHeight = newWidth / aspectRatio.current;
      
      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    
    if (isDragging) {
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;
      const constrainedX = Math.max(-100, Math.min(window.innerWidth - 100, newX));
      const constrainedY = Math.max(0, Math.min(window.innerHeight - 50, newY));
      setPosition({ x: constrainedX, y: constrainedY });
    }
    
    if (isResizing) {
      const deltaX = touch.clientX - resizeStart.x;
      const deltaY = touch.clientY - resizeStart.y;
      const delta = (deltaX + deltaY) / 2;
      
      const newWidth = Math.max(300, resizeStart.width + delta);
      const newHeight = newWidth / aspectRatio.current;
      
      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isResizing ? 'nwse-resize' : 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleTouchMove, handleEnd]);

  const containerStyle = {
    position: 'fixed',
    zIndex: zIndex || Z_INDEX.WINDOWS_ACTIVE,
    width: size.width,
    height: size.height,
    ...(position ? { left: position.x, top: position.y } : { top: 360, left: 100 }),
  };


  const currentCode = codeFiles[activeIndex]?.code || '';

  return (
    <div 
      ref={containerRef} 
      style={containerStyle} 
      data-draggable-window
      onMouseDownCapture={() => onFocus && onFocus()}
      onTouchStartCapture={() => onFocus && onFocus()}
      onMouseDown={dragAnywhere ? handleMouseDown : undefined}
      onTouchStart={dragAnywhere ? handleTouchStart : undefined}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: `1px solid ${VSCODE_COLORS.border}`,
        backgroundColor: VSCODE_COLORS.background,
        borderRadius: '8px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        height: '100%',
        position: 'relative',
      }}>
        {/* Draggable header with tabs */}
        <div
          onMouseDown={!dragAnywhere ? handleMouseDown : undefined}
          onTouchStart={!dragAnywhere ? handleTouchStart : undefined}
          style={{
            backgroundColor: VSCODE_COLORS.headerBg,
            flexShrink: 0,
            borderBottom: `1px solid ${VSCODE_COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            height: '36px',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
          }}
        >
          {codeFiles.map((file, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                paddingLeft: '10px',
                paddingRight: '12px',
                height: '100%',
                backgroundColor: index === activeIndex ? VSCODE_COLORS.background : 'transparent',
                borderTop: index === activeIndex ? `2px solid ${VSCODE_COLORS.accent}` : '2px solid transparent',
                borderRight: `1px solid ${VSCODE_COLORS.border}`,
                opacity: index === activeIndex ? 1 : 0.6,
              }}
            >
              {file.icon === 'ts' ? (
                <TsIcon style={{ color: index === activeIndex ? undefined : '#808080' }} />
              ) : (
                <ReactIcon style={{ color: index === activeIndex ? VSCODE_COLORS.reactBlue : '#808080' }} />
              )}
              <span style={{ 
                color: index === activeIndex ? VSCODE_COLORS.textMuted : '#808080', 
                fontSize: '13px',
              }}>
                {file.name}
              </span>
            </div>
          ))}
        </div>

        <div 
          ref={scrollContainerRef}
          style={{ 
            flex: 1, 
            overflow: 'auto', 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            [data-code-scroll]::-webkit-scrollbar {
              display: none;
            }
            /* Force font-size inheritance to override Shiki's default styles */
            [data-code-scroll] pre,
            [data-code-scroll] code,
            [data-code-scroll] span {
              font-size: inherit !important;
              line-height: inherit !important;
              font-family: inherit !important;
            }
          `}</style>
          <div style={{ paddingTop: `${8 * scaleFactor}px` }}>
            <CodeBlockPrimitive 
              key={activeIndex}
              code={currentCode}
              lang={activeIndex === 1 ? 'typescript' : 'tsx'}
              writing={true} 
              duration={40500} 
              theme="dark"
              scrollContainerRef={scrollContainerRef}
              onDone={handleFileDone}
              data-code-scroll
              style={{
                fontSize: `${13 * scaleFactor}px`,
                lineHeight: '1.5',
                paddingTop: `${12 * scaleFactor}px`,
                paddingBottom: `${12 * scaleFactor}px`,
                paddingLeft: `${16 * scaleFactor}px`,
                paddingRight: `${16 * scaleFactor}px`,
                backgroundColor: VSCODE_COLORS.background,
                color: '#d4d4d4',
                fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'SF Mono', Consolas, monospace",
                minHeight: '100%',
              }}
            />
          </div>
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={handleResizeMouseDown}
          onTouchStart={handleResizeTouchStart}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '20px',
            height: '20px',
            cursor: 'nwse-resize',
            background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.2) 50%)',
            touchAction: 'none',
            borderBottomRightRadius: '8px',
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}
