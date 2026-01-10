import React, { useRef, useCallback } from 'react';
import { Z_INDEX } from '../../constants';
import DraggableWindow from './DraggableWindow';

export default function TextWindow({ title, content, onClose, zIndex, onFocus, width = 400, height = 300, initialPosition = { top: 100, left: 100 }, fontSize = 21, dragAnywhere = false, useThemedScrollbar = false }) {
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
        {content}
      </div>
    </DraggableWindow>
  );
}
