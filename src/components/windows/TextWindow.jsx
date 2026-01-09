import React from 'react';
import { Z_INDEX } from '../../constants';
import DraggableWindow from './DraggableWindow';

export default function TextWindow({ title, content, onClose, zIndex, onFocus, width = 400, height = 300, initialPosition = { top: 100, left: 100 }, fontSize = 21 }) {
  return (
    <DraggableWindow
      title={title}
      initialPosition={initialPosition}
      style={{ width: `${width}px`, height: `${height}px` }}
      zIndex={zIndex || Z_INDEX.WINDOWS_BASE}
      onFocus={onFocus}
      resizable={true}
      onClose={onClose}
      dragAnywhere={false}
    >
      <div style={{ 
        background: '#fff', 
        width: '100%',
        height: '100%',
        overflow: 'auto',
        padding: '24px',
        fontSize: `${fontSize}px`,
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}>
        {content}
      </div>
    </DraggableWindow>
  );
}
