'use client';
import * as React from 'react';

import { CodeBlock as CodeBlockPrimitive } from '@/components/animate-ui/primitives/animate/code-block';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/animate-ui/components/buttons/copy';
import { getStrictContext } from '@/lib/get-strict-context';

const [CodeProvider, useCode] = getStrictContext('CodeContext');

const VSCODE_COLORS = {
  background: '#1e1e1e',
  headerBg: '#252526',
  border: '#3c3c3c',
  text: '#d4d4d4',
  textMuted: '#cccccc',
  accent: '#007acc',
  reactBlue: '#61DAFB',
};

function Code({ className, code, files, ...props }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const isMultiFile = files && files.length > 0;
  const currentCode = isMultiFile ? files[activeIndex]?.code : code;
  
  const handleFileDone = React.useCallback(() => {
    if (isMultiFile && activeIndex < files.length - 1) {
      setTimeout(() => setActiveIndex(prev => prev + 1), 1500);
    } else if (isMultiFile) {
      setTimeout(() => setActiveIndex(0), 2000);
    }
  }, [isMultiFile, activeIndex, files?.length]);

  return (
    <CodeProvider value={{ code: currentCode, files, activeIndex, setActiveIndex, onDone: handleFileDone, isMultiFile }}>
      <div
        className={cn('vscode-container', className)}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: `1px solid ${VSCODE_COLORS.border}`,
          backgroundColor: VSCODE_COLORS.background,
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'SF Mono', Consolas, monospace",
        }}
        {...props}
      />
    </CodeProvider>
  );
}

function ReactIcon({ style }) {
  return (
    <svg 
      style={{ width: '14px', height: '14px', flexShrink: 0, ...style }}
      viewBox="-11 -10.5 22 21" 
      fill="currentColor"
    >
      <circle r="2" />
      <g stroke="currentColor" fill="none" strokeWidth="1">
        <ellipse rx="10" ry="4.5" />
        <ellipse rx="10" ry="4.5" transform="rotate(60)" />
        <ellipse rx="10" ry="4.5" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function JsonIcon({ style }) {
  return (
    <svg style={{ width: '14px', height: '14px', flexShrink: 0, ...style }} viewBox="0 0 24 24" fill="none">
      <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#f1c40f" opacity="0.2"/>
      <text x="6" y="16" fontSize="10" fontWeight="bold" fill="#f1c40f">{`{}`}</text>
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

function CodeHeader({ className, children, icon: Icon, copyButton = false, tabs = [], ...props }) {
  const { code, files, activeIndex, isMultiFile } = useCode();

  const allTabs = isMultiFile 
    ? files.map((file, idx) => ({
        name: file.name,
        icon: file.icon || 'react',
        active: idx === activeIndex,
      }))
    : [{ name: children, active: true, icon: 'react' }, ...tabs];

  const getIcon = (iconType, isActive) => {
    const color = isActive ? undefined : '#808080';
    switch (iconType) {
      case 'react':
        return <ReactIcon style={{ color: color || VSCODE_COLORS.reactBlue }} />;
      case 'json':
        return <JsonIcon style={{ color: color || '#f1c40f' }} />;
      case 'ts':
        return <TsIcon style={{ color }} />;
      default:
        return <ReactIcon style={{ color: color || VSCODE_COLORS.reactBlue }} />;
    }
  };

  return (
    <div
      className={cn('vscode-header', className)}
      style={{
        backgroundColor: VSCODE_COLORS.headerBg,
        flexShrink: 0,
        borderBottom: `1px solid ${VSCODE_COLORS.border}`,
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '36px',
        fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'SF Mono', Consolas, monospace",
      }}
      {...props}
    >
      {allTabs.map((tab, index) => (
        <div 
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            paddingLeft: '10px',
            paddingRight: '12px',
            height: '100%',
            backgroundColor: tab.active ? VSCODE_COLORS.background : 'transparent',
            borderTop: tab.active ? `2px solid ${VSCODE_COLORS.accent}` : '2px solid transparent',
            borderRight: `1px solid ${VSCODE_COLORS.border}`,
            cursor: 'pointer',
            opacity: tab.active ? 1 : 0.6,
          }}
        >
          {getIcon(tab.icon, tab.active)}
          <span style={{ 
            color: tab.active ? VSCODE_COLORS.textMuted : '#808080', 
            fontSize: '13px',
            fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'SF Mono', Consolas, monospace",
          }}>
            {tab.name}
          </span>
        </div>
      ))}
      {copyButton && (
        <CopyButton
          content={code}
          size="xs"
          variant="ghost"
          style={{ marginLeft: 'auto' }}
        />
      )}
    </div>
  );
}

function CodeBlock({ cursor, className, theme = 'dark', ...props }) {
  const { code, onDone, isMultiFile, activeIndex } = useCode();
  const scrollRef = React.useRef(null);

  return (
    <CodeBlockPrimitive
      key={isMultiFile ? activeIndex : 'single'}
      ref={scrollRef}
      theme={theme}
      scrollContainerRef={scrollRef}
      className={cn('vscode-code-block', className)}
      style={{
        position: 'relative',
        fontSize: '13px',
        lineHeight: '1.5',
        padding: '12px 16px',
        overflow: 'auto',
        backgroundColor: VSCODE_COLORS.background,
        color: VSCODE_COLORS.text,
        fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'SF Mono', Consolas, monospace",
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      code={code}
      onDone={onDone}
      {...props}
    />
  );
}

export { Code, CodeHeader, CodeBlock };
