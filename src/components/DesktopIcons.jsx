import React from 'react';

const DesktopIcon = ({ icon, label, onClick }) => (
    <div 
        onClick={onClick}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '6px',
            width: '74px',
            userSelect: 'none',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.querySelector('.icon-wrapper').style.filter = 'invert(1)';
            e.currentTarget.querySelector('.icon-wrapper').style.backgroundColor = '#000';
            e.currentTarget.querySelector('.icon-label').style.backgroundColor = '#000';
            e.currentTarget.querySelector('.icon-label').style.color = '#fff';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.querySelector('.icon-wrapper').style.filter = 'none';
            e.currentTarget.querySelector('.icon-wrapper').style.backgroundColor = 'transparent';
            e.currentTarget.querySelector('.icon-label').style.backgroundColor = 'transparent';
            e.currentTarget.querySelector('.icon-label').style.color = '#000';
        }}
    >
        <div 
            className="icon-wrapper"
            style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px',
                imageRendering: 'pixelated',
            }}
        >
            {icon}
        </div>
        <span 
            className="icon-label"
            style={{
                fontSize: '9px',
                fontWeight: 400,
                textAlign: 'center',
                color: '#000',
                lineHeight: 1.2,
                wordBreak: 'break-word',
                padding: '1px 2px',
            }}
        >
            {label}
        </span>
    </div>
);

const HardDriveIcon = () => (
    <svg width="38" height="38" viewBox="0 0 32 32">
        <polygon points="4,10 16,4 28,10 16,16" fill="#e8e8e8" stroke="#000" strokeWidth="1.5"/>
        <polygon points="28,10 28,22 16,28 16,16" fill="#b0b0b0" stroke="#000" strokeWidth="1.5"/>
        <polygon points="4,10 16,16 16,28 4,22" fill="#888" stroke="#000" strokeWidth="1.5"/>
        <rect x="6" y="14" width="6" height="2" fill="#444"/>
        <rect x="8" y="18" width="2" height="2" fill="#00cc00"/>
    </svg>
);

const FolderIcon = () => (
    <svg width="38" height="38" viewBox="0 0 32 32">
        <path d="M4,8 L4,6 Q4,4 6,4 L12,4 L14,8" fill="#ffdd77" stroke="#000" strokeWidth="1.5"/>
        <rect x="4" y="8" width="24" height="20" rx="1" fill="#ffcc55" stroke="#000" strokeWidth="1.5"/>
        <line x1="4" y1="12" x2="28" y2="12" stroke="#cc9922" strokeWidth="1"/>
        <line x1="5" y1="13" x2="27" y2="13" stroke="#ffee99" strokeWidth="1"/>
    </svg>
);

const DocumentIcon = () => (
    <svg width="38" height="38" viewBox="0 0 32 32">
        <path d="M8,4 L8,30 L28,30 L28,10 L22,4 Z" fill="#aaa"/>
        <path d="M6,2 L6,28 L26,28 L26,8 L20,2 Z" fill="#fff" stroke="#000" strokeWidth="1.5"/>
        <path d="M20,2 L20,8 L26,8" fill="#ddd" stroke="#000" strokeWidth="1.5"/>
        <line x1="9" y1="12" x2="23" y2="12" stroke="#000" strokeWidth="1"/>
        <line x1="9" y1="16" x2="23" y2="16" stroke="#000" strokeWidth="1"/>
        <line x1="9" y1="20" x2="18" y2="20" stroke="#000" strokeWidth="1"/>
    </svg>
);

const TrashIcon = () => (
    <svg width="38" height="38" viewBox="0 0 32 32">
        <path d="M12,4 L12,2 Q12,0 14,0 L18,0 Q20,0 20,2 L20,4" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
        <rect x="4" y="4" width="24" height="5" rx="1" fill="#ddd" stroke="#000" strokeWidth="1.5"/>
        <path d="M6,9 L6,28 Q6,30 8,30 L24,30 Q26,30 26,28 L26,9" fill="#ccc" stroke="#000" strokeWidth="1.5"/>
        <line x1="11" y1="14" x2="11" y2="25" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="16" y1="14" x2="16" y2="25" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="21" y1="14" x2="21" y2="25" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const DesktopIcons = ({ onTrashClick, onScheduleClick }) => {
    return (
        <div 
            className="desktop-icons"
            style={{
                position: 'fixed',
                top: '12px',
                right: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 10,
                pointerEvents: 'auto',
            }}
        >
            <DesktopIcon 
                icon={<HardDriveIcon />} 
                label="DePaul HD" 
                onClick={() => window.open('https://www.depaul.edu/hello/Pages/ugrad-info.aspx', '_blank')}
            />
            <DesktopIcon 
                icon={<FolderIcon />} 
                label="DemonHacks" 
                onClick={() => window.open('https://demonhacks.vercel.app/', '_blank')}
            />
            <DesktopIcon 
                icon={<FolderIcon />} 
                label="UPE" 
                onClick={() => window.open('https://upe.cdm.depaul.edu/events/', '_blank')}
            />
            <DesktopIcon 
                icon={<DocumentIcon />} 
                label="Schedule.txt" 
                onClick={onScheduleClick}
            />
            <DesktopIcon 
                icon={<TrashIcon />} 
                label="Trash" 
                onClick={onTrashClick}
            />
        </div>
    );
};

export default DesktopIcons;
