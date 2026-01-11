import React, { useRef, useCallback, useMemo } from 'react';
import { Z_INDEX } from '../../constants';
import DraggableWindow from './DraggableWindow';

export default function TextWindow({ title, content, onClose, zIndex, onFocus, width = 400, height = 300, initialPosition = { top: 100, left: 100 }, fontSize = 21, dragAnywhere = false, useThemedScrollbar = false, boldTimes = false }) {
  const contentRef = useRef(null);
  const SCROLLBAR_WIDTH = 24;

  const isOnScrollbar = useCallback((e) => {
    if (!contentRef.current) return false;
    const rect = contentRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return clientX > rect.right - SCROLLBAR_WIDTH;
  }, []);

  const handleContentMouseDown = useCallback((e) => {
    if (isOnScrollbar(e)) {
      e.stopPropagation();
    }
  }, [isOnScrollbar]);

  const handleContentTouchStart = useCallback((e) => {
    if (isOnScrollbar(e)) {
      e.stopPropagation();
    }
  }, [isOnScrollbar]);

  const renderedContent = useMemo(() => {
    if (!boldTimes || typeof content !== 'string') {
      return content;
    }
    
    const patterns = [
      /(\d{1,2}:\d{2}\s*(?:AM|PM))/g,
      /(DEMONHACKS 2026)/g,
      /(OFFICIAL SCHEDULE)/g,
      /(SATURDAY, FEBRUARY 28, 2026)/g,
      /(SUNDAY, MARCH 1, 2026)/g,
      /(END OF SCHEDULE)/g,
      /(DEMONHACKS 2026 - FAQ)/g,
      /(Q: [^\n]+)/g,
      /(deltaupe@cdm\.depaul\.edu)/g,
      /(All students are welcome!)/g,
      /(completely free!)/g,
      /(ANY university or college)/g,
      /(No, there are no travel reimbursements)/g,
    ];
    
    const combinedPattern = new RegExp(
      patterns.map(p => p.source).join('|'),
      'g'
    );
    
    const parts = content.split(combinedPattern);
    
    return parts.map((part, index) => {
      if (part && combinedPattern.test(part)) {
        combinedPattern.lastIndex = 0;
        return <strong key={index}>{part}</strong>;
      }
      combinedPattern.lastIndex = 0;
      return part;
    });
  }, [content, boldTimes]);

  return (
    <DraggableWindow
      title={title}
      initialPosition={initialPosition}
      style={{ width: `${width}px`, height: `${height}px` }}
      zIndex={zIndex || Z_INDEX.WINDOWS_BASE}
      onFocus={onFocus}
      resizable={true}
      onClose={onClose}
      dragAnywhere={dragAnywhere}
    >
      <div 
        ref={contentRef}
        className={useThemedScrollbar ? 'window-pane' : ''}
        onMouseDown={dragAnywhere ? handleContentMouseDown : undefined}
        onTouchStart={dragAnywhere ? handleContentTouchStart : undefined}
        style={{ 
          background: '#fff', 
          width: '100%',
          height: '100%',
          overflowY: useThemedScrollbar ? 'scroll' : 'auto',
          overflowX: 'hidden',
          padding: '24px',
          fontSize: `${fontSize}px`,
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          fontFamily: '"Courier New", Courier, monospace',
          wordWrap: 'break-word',
          boxSizing: 'border-box',
          cursor: dragAnywhere ? 'grab' : 'auto',
        }}>
        {renderedContent}
      </div>
    </DraggableWindow>
  );
}
