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
    <p className={className} style={{ marginTop: '4px', fontSize: '9pt', color: '#666' }}>
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

export const Select = React.forwardRef(({ children, className = "", style = {}, ...props }, ref) => (
    <select 
        ref={ref}
        className={className}
        style={{ marginBottom: '8px', fontSize: '13px', padding: '4px 6px', boxSizing: 'border-box', ...style }}
        {...props}
    >
        {children}
    </select>
));
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
