import React from 'react';

export const Field = ({ children, className = "", ...props }) => (
    <div className={`group ${className}`} {...props}>
        {children}
    </div>
);

export const FieldLabel = ({ children, htmlFor, required, className = "" }) => (
    <label htmlFor={htmlFor} className={className} style={{ display: 'block', marginBottom: '4px' }}>
        {children}
        {required && <span style={{ color: 'red' }}> *</span>}
    </label>
);

export const FieldDescription = ({ children, className = "" }) => (
    <p className={className} style={{ marginTop: '4px', fontSize: '9pt', color: '#444' }}>
        {children}
    </p>
);

export const FieldError = ({ message, className = "" }) => {
    if (!message) return null;
    return (
        <p className={className} style={{ marginTop: '4px', fontSize: '9pt', color: 'red' }}>
            {message}
        </p>
    );
};

export const Input = React.forwardRef(({ className = "", type = "text", style = {}, ...props }, ref) => (
    <input 
        ref={ref}
        type={type}
        autoComplete="off"
        className={`text-box ${className}`}
        style={{ marginBottom: '8px', fontSize: '13px', padding: '4px 6px', boxSizing: 'border-box', ...style }}
        {...props}
    />
));
Input.displayName = 'Input';

export const Select = React.forwardRef(({ children, className = "", style = {}, value, onChange, onBlur, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef(null);

    const allOptions = React.Children.toArray(children)
        .filter(child => child.type === 'option')
        .map(child => ({
            value: child.props.value,
            label: child.props.children
        }));

    const placeholderOption = allOptions.find(opt => opt.value === '');
    const options = allOptions.filter(opt => opt.value !== '');

    const selectedOption = allOptions.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholderOption?.label || 'Select...';

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange?.({ target: { value: optionValue } });
        setIsOpen(false);
        onBlur?.();
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', marginBottom: '8px', ...style }}>
            <input type="hidden" ref={ref} value={value} {...props} />
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`text-box ${className}`}
                style={{
                    width: '100%',
                    fontSize: '13px',
                    padding: '4px 6px',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#fff',
                    border: '1.5px solid #000',
                    color: '#000',
                    WebkitTapHighlightColor: 'transparent',
                    outline: 'none',
                    borderRadius: '0',
                }}
            >
                <span>{displayText}</span>
                <span style={{ fontSize: '10px', marginLeft: '8px' }}>▼</span>
            </button>
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#fff',
                        border: '1px solid #000',
                        borderTop: 'none',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto',
                    }}
                >
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(option.value)}
                            style={{
                                padding: '6px 8px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                background: option.value === value ? '#000' : 'transparent',
                                color: option.value === value ? '#fff' : '#000',
                            }}
                            onMouseEnter={(e) => {
                                if (option.value !== value) {
                                    e.currentTarget.style.background = '#e0e0e0';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = option.value === value ? '#000' : 'transparent';
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});
Select.displayName = 'Select';

export const RadioItem = React.forwardRef(({ label, className = "", id, ...props }, ref) => {
    const inputId = id || `radio-${props.name}-${props.value}`;
    return (
        <div className={className} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px', paddingLeft: '4px' }}>
            <input ref={ref} type="radio" id={inputId} style={{ marginTop: '3px', flexShrink: 0 }} {...props} />
            <label htmlFor={inputId} style={{ fontSize: '13px', lineHeight: '1.3', cursor: 'pointer' }}>{label}</label>
        </div>
    );
});
RadioItem.displayName = 'RadioItem';

export const CheckboxItem = React.forwardRef(({ label, className = "", id, ...props }, ref) => {
    const inputId = id || `checkbox-${props.name}-${props.value}`;
    return (
        <div className={className} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px', paddingLeft: '4px' }}>
            <input ref={ref} type="checkbox" id={inputId} style={{ marginTop: '2px', flexShrink: 0 }} {...props} />
            <label htmlFor={inputId} style={{ fontSize: '13px', lineHeight: '1.3', cursor: 'pointer' }}>{label}</label>
        </div>
    );
});
CheckboxItem.displayName = 'CheckboxItem';

export const Button = ({ children, variant = "primary", isLoading = false, className = "", ...props }) => (
    <button 
        className={`${variant === "primary" ? "btn btn-default" : "btn"} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
    >
        {isLoading ? 'Submitting...' : children}
    </button>
);
